const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

const contentDir = path.join(__dirname, 'content');
const ig = ignore();
try {
  const gitignoreContent = fs.readFileSync(path.join(__dirname, '.gitignore'), 'utf8');
  ig.add(gitignoreContent);
} catch (e) {
  // Ignore missing .gitignore
}

function getDirectoryTree(dirPath, basePath = '') {
  let tree = [];
  if (!fs.existsSync(dirPath)) return tree;
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  items.forEach(item => {
    if (item.name.startsWith('.') && item.name !== '.gitignore') return;
    if (item.name === 'node_modules' || item.name === 'public') return;

    const itemPath = path.join(dirPath, item.name);
    const relPath = path.posix.join(basePath, item.name);

    if (ig.ignores(relPath)) return;

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

const tree = getDirectoryTree(contentDir);
const json = JSON.stringify(tree, null, 2);

fs.writeFileSync(path.join(__dirname, 'tree.json'), json);
if (fs.existsSync(path.join(__dirname, 'public'))) {
  fs.writeFileSync(path.join(__dirname, 'public', 'tree.json'), json);
}

console.log(`Successfully generated tree.json and public/tree.json`);
