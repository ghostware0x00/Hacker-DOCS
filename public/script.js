document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('nav-container');
  const markdownBody = document.getElementById('markdown-body');
  const activePathSpan = document.getElementById('active-path');
  const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
  const sidebar = document.getElementById('sidebar');
  const resizer = document.getElementById('resizer');

  // --- Sidebar Resizing Logic ---
  let isDragging = false;

  resizer.addEventListener('mousedown', (e) => {
    isDragging = true;
    resizer.classList.add('dragging');
    sidebar.classList.add('no-transition'); // Disable snapping lag temporarily
    document.body.style.cursor = 'col-resize';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    // Don't drag if sidebar is hidden
    if (sidebar.classList.contains('collapsed')) return;
    
    let newWidth = e.clientX;
    // Apply constraints dynamically if mouse goes extremely far
    if (newWidth < 150) newWidth = 150;
    if (newWidth > 800) newWidth = 800;

    sidebar.style.width = `${newWidth}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      resizer.classList.remove('dragging');
      sidebar.classList.remove('no-transition');
      document.body.style.cursor = 'default';
    }
  });

  // --- Sidebar Toggle Logic ---
  toggleSidebarBtn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      // Mobile behavior
      sidebar.classList.toggle('mobile-open');
    } else {
      // Desktop behavior
      sidebar.classList.toggle('collapsed');
      if (sidebar.classList.contains('collapsed')) {
        resizer.style.display = 'none';
      } else {
        resizer.style.display = 'block';
      }
    }
  });

  // Fetch Tree (Dynamic API with static fallback for GitHub Pages)
  async function fetchTree() {
    try {
      let res = await fetch('/api/tree').catch(() => null);
      if (!res || !res.ok) {
        // Fallback to static tree.json for GitHub Pages
        res = await fetch('tree.json').catch(() => null) || await fetch('public/tree.json');
      }
      if (!res || !res.ok) throw new Error(`HTTP ${res ? res.status : 'offline'}`);
      const tree = await res.json();
      navContainer.innerHTML = '';
      const ul = buildTreeUI(tree);
      navContainer.appendChild(ul);
    } catch (e) {
      console.error('Failed to load tree:', e);
      navContainer.innerHTML = '<div style="color:var(--red);padding:15px;">Error loading files</div>';
    }
  }

  function buildTreeUI(nodes) {
    const ul = document.createElement('ul');
    ul.className = 'nav-tree';

    nodes.forEach(node => {
      const li = document.createElement('li');
      li.className = 'nav-item';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'nav-title';
      titleDiv.dataset.path = node.path;
      
      const icon = document.createElement('span');
      icon.className = 'icon';

      const text = document.createElement('span');
      text.textContent = node.name.replace('.md', '');

      if (node.type === 'directory') {
        icon.textContent = '📁';
        titleDiv.appendChild(icon);
        titleDiv.appendChild(text);
        li.appendChild(titleDiv);
        
        const childrenUl = buildTreeUI(node.children);
        childrenUl.style.display = 'none';
        li.appendChild(childrenUl);

        titleDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          const isCollapsed = childrenUl.style.display === 'none';
          childrenUl.style.display = isCollapsed ? 'block' : 'none';
          icon.textContent = isCollapsed ? '📂' : '📁';
        });

      } else {
        icon.textContent = '📄';
        titleDiv.appendChild(icon);
        titleDiv.appendChild(text);
        li.appendChild(titleDiv);

        titleDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          document.querySelectorAll('.nav-title.active').forEach(el => el.classList.remove('active'));
          titleDiv.classList.add('active');
          loadContent(node.path);
          if (window.innerWidth <= 768) sidebar.classList.remove('mobile-open');
        });
      }
      ul.appendChild(li);
    });

    return ul;
  }

  async function loadContent(path) {
    if (!path) return;
    
    // Update hash without triggering hashchange
    window.location.hash = path;
    
    activePathSpan.textContent = path;
    markdownBody.innerHTML = '<div style="text-align:center;color:var(--text-muted);margin-top:50px;">Loading... ⚡</div>';
    
    try {
      let renderedHtml = null;

      // 1. Try server-rendered HTML first (when running node server.js)
      try {
        const apiRes = await fetch(`/api/content?path=${encodeURIComponent(path)}`);
        if (apiRes.ok) {
          const data = await apiRes.json();
          if (data && data.html) renderedHtml = data.html;
        }
      } catch (err) {
        // Express API not running, fall back to static mode
      }

      // 2. If no server HTML (e.g., on GitHub Pages), fetch raw markdown and render on client
      if (!renderedHtml) {
        const res = await fetch(`./content/${path}`);
        if (!res.ok) throw new Error(`File not found: ${res.status}`);
        let content = await res.text();

        const renderer = new marked.Renderer();
        const folderPath = path.includes('/') ? path.split('/').slice(0, -1).join('/') : '';
        
        renderer.image = ({ href, title, text }) => {
          let finalHref = href;
          if (finalHref && !finalHref.startsWith('http') && !finalHref.startsWith('/') && !finalHref.startsWith('./content/')) {
            const cleanHref = finalHref.replace(/^\.\//, '');
            finalHref = `./content/${folderPath ? folderPath + '/' : ''}${cleanHref}`;
          }
          let out = `<img src="${finalHref}" alt="${text || ''}"`;
          if (title) out += ` title="${title}"`;
          out += '>';
          return out;
        };

        // Support Obsidian image format ![[filename.png]]
        content = content.replace(/!\[\[(.*?)\]\]/g, (match, p1) => {
          const cleanP1 = p1.replace(/^\.\//, '');
          const imgPath = `./content/${folderPath ? folderPath + '/' : ''}${cleanP1}`;
          return `![Obsidian Image](${imgPath})`;
        });

        renderedHtml = marked.parse(content, { renderer, gfm: true, breaks: false });
      }

      markdownBody.innerHTML = `<div class="fade-in">${renderedHtml}</div>`;
      decorateCodeBlocks();

    } catch (e) {
      console.error(e);
      markdownBody.innerHTML = `<div style="color:var(--red);text-align:center;"><h2>Error</h2><p>${e.message}</p></div>`;
    }
  }

  function decorateCodeBlocks() {
    document.querySelectorAll('.markdown-body pre').forEach(pre => {
      const codeEl = pre.querySelector('code');
      if (!codeEl) return;

      // Apply highlighting
      hljs.highlightElement(codeEl);

      if (pre.parentElement.classList.contains('code-content')) return;

      let lang = 'bash';
      if (codeEl.className) {
        const match = codeEl.className.match(/language-(\w+)/);
        if (match) lang = match[1];
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'custom-code-block';
      const header = document.createElement('div');
      header.className = 'code-header';
      const leftGroup = document.createElement('div');
      leftGroup.className = 'left-group';
      const windowControls = document.createElement('div');
      windowControls.className = 'window-controls';
      windowControls.innerHTML = '<div class="ctrl red"></div><div class="ctrl yellow"></div><div class="ctrl green"></div>';
      
      const langLabel = document.createElement('div');
      langLabel.className = 'lang-label';
      langLabel.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>` + lang;

      leftGroup.appendChild(windowControls);
      leftGroup.appendChild(langLabel);

      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>COPY</span>`;
      
      copyBtn.onclick = () => {
        const textToCopy = codeEl.innerText;
        navigator.clipboard.writeText(textToCopy);
        copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> <span class="copied" style="color:var(--green)">COPIED</span>`;
        setTimeout(() => {
          copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>COPY</span>`;
        }, 2000);
      };

      header.appendChild(leftGroup);
      header.appendChild(copyBtn);
      wrapper.appendChild(header);
      pre.parentNode.insertBefore(wrapper, pre);
      const codeContent = document.createElement('div');
      codeContent.className = 'code-content';
      codeContent.appendChild(pre);
      wrapper.appendChild(codeContent);
    });
  }

  // Handle Initial Hash
  async function handleHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      loadContent(decodeURIComponent(hash));
      // Try to highlight in sidebar
      setTimeout(() => {
        const titleEl = document.querySelector(`.nav-title[data-path="${decodeURIComponent(hash)}"]`);
        if (titleEl) {
          titleEl.classList.add('active');
          // Expand parents
          let parent = titleEl.parentElement.parentElement; // UL
          while (parent && parent.classList.contains('nav-tree')) {
            parent.style.display = 'block';
            const folderTitle = parent.previousElementSibling;
            if (folderTitle && folderTitle.classList.contains('nav-title')) {
              const icon = folderTitle.querySelector('.icon');
              if (icon) icon.textContent = '📂';
            }
            parent = parent.parentElement.parentElement;
          }
        }
      }, 500);
    }
  }

  fetchTree().then(() => {
    handleHash();
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) loadContent(decodeURIComponent(hash));
  });
});
