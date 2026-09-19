const express = require('express');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { markedHighlight } = require('marked-highlight');
const hljs = require('highlight.js');
const ignore = require('ignore');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

const contentDir = path.join(__dirname, 'content');

// Serve content at /content/ (used by script.js fetch calls) and /files/ (legacy)
app.use('/content', express.static(contentDir));
app.use('/files', express.static(contentDir));

// Register NASM as x86asm for highlight.js to support specific code blocks
hljs.registerAliases('nasm', { languageName: 'x86asm' });

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

const ig = ignore();
try {
  const gitignoreContent = fs.readFileSync(path.join(__dirname, '.gitignore'), 'utf8');
  ig.add(gitignoreContent);
} catch (e) {
  // Ignore missing .gitignore
}

function getDirectoryTree(dirPath, basePath = '') {
  let tree = [];
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  items.forEach(item => {
    // Ignore internal or irrelevant paths
    if (item.name.startsWith('.') && item.name !== '.gitignore') return;
    if (item.name === 'node_modules' || item.name === 'public' || item.name === 'package.json' || item.name === 'package-lock.json' || item.name === 'server.js') return;
    
    const itemPath = path.join(dirPath, item.name);
    const relPath = path.posix.join(basePath, item.name);
    
    if (ig.ignores(relPath)) {
      return; // Skip gitignored paths
    }

    if (item.isDirectory()) {
      const children = getDirectoryTree(itemPath, relPath);
      if (children.length > 0) {
        tree.push({ name: item.name, path: relPath, type: 'directory', children });
      }
    } else if (item.isFile() && item.name.endsWith('.md')) {
      tree.push({ name: item.name, path: relPath, type: 'file' });
    }
  });

  return tree.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'directory' ? -1 : 1;
  });
}

// API to get structure
app.get('/api/tree', (req, res) => {
  try {
    const tree = getDirectoryTree(contentDir);
    res.json(tree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to get content of an MD file
app.get('/api/content', (req, res) => {
  const relPath = req.query.path;
  if (!relPath || relPath.includes('..')) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const absolutePath = path.join(contentDir, relPath);
  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  try {
    let content = fs.readFileSync(absolutePath, 'utf8');
    // Basic Obsidian image parsing ![[image.png]]
    content = content.replace(/!\[\[(.*?)\]\]/g, '![Obsidian Image](/files/$1)');
    
    const folderPath = path.posix.dirname(relPath);
    
    // Customize marked renderer to prepend path to local images
    const renderer = new marked.Renderer();
    renderer.image = ({ href, title, text }) => {
      let finalHref = href;
      if(finalHref && !finalHref.startsWith('http') && !finalHref.startsWith('/files/')) {
        // Prepend the /files + folder path
        finalHref = '/files/' + path.posix.join(folderPath, finalHref).replace(/\\/g, '/');
      }
      let out = '<img src="' + finalHref + '" alt="' + text + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += '>';
      return out;
    };

    const htmlContent = marked.parse(content, { renderer });
    res.json({ html: htmlContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
