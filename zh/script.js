function $(s) { return document.querySelector(s); }
function $$(s) { return document.querySelectorAll(s); }
function getState() {
  try { return JSON.parse(localStorage.getItem('vhs_state') || '{}'); }
  catch { return {}; }
}
function setState(patch) {
  const s = getState(); Object.assign(s, patch);
  localStorage.setItem('vhs_state', JSON.stringify(s));
}
function resetState() {
  localStorage.removeItem('vhs_state');
  localStorage.removeItem('vhs_notes');
}
function getNotes() {
  try { return JSON.parse(localStorage.getItem('vhs_notes') || '[]'); }
  catch { return []; }
}
function saveNote(text) {
  const notes = getNotes();
  if (notes.some(n => n.text === text)) return;
  notes.push({ text, time: new Date().toLocaleString('zh-CN') });
  localStorage.setItem('vhs_notes', JSON.stringify(notes));
  renderNotebook();
}
function renderNotebook() {
  const panel = $('.notebook-panel');
  if (!panel) return;
  const notes = getNotes();
  if (!notes.length) {
    panel.innerHTML = '<h3>// 笔记本</h3><p style="font-size:0.8rem;color:#6e6b64;">还没有记录。线索会自动保存。</p>';
    return;
  }
  panel.innerHTML = '<h3>// 笔记本</h3>' + notes.map(n =>
    `<div class="item">${n.text}<span class="time">${n.time}</span></div>`
  ).join('');
}
function toggleNotebook() { $('.notebook-panel').classList.toggle('open'); }
function doSearch(q) {
  if (!q) return;
  const s = q.toLowerCase().trim();
  const routes = {
    '首页': 'home.html', '简介': 'home.html', '陆远': 'about.html', '关于': 'about.html',
    '磁带盒': 'box.html', '编号': 'box.html', '盒': 'box.html',
    '第一': 'tape-01.html', '第二': 'tape-02.html', '第三': 'tape-03.html',
    '笔记': 'notes.html', '学校': 'school.html', '论坛': 'forum.html',
    '新闻': 'news.html', '失踪': 'missing.html', '档案': 'missing.html',
    '终端': 'terminal.html', '解码': 'decode.html', '密码': 'decode.html',
    '最后': 'final.html', '最终': 'final.html'
  };
  for (const k in routes) {
    if (s.includes(k) || k.includes(s)) { location.href = routes[k]; return; }
  }
  alert('没有找到相关文件。试试"磁带盒"、"笔记"、"失踪"、"终端"。');
}
document.addEventListener('DOMContentLoaded', () => {
  $$('.searchbar input').forEach(input => {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(input.value); });
  });
  $$('.searchbar button').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      doSearch(input.value);
    });
  });
  if (!$('.notebook')) {
    const nb = document.createElement('div');
    nb.className = 'notebook';
    nb.innerHTML = `<button class="notebook-btn" onclick="toggleNotebook()">📓</button><div class="notebook-panel"></div>`;
    document.body.appendChild(nb);
  }
  renderNotebook();
});
