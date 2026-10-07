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
  notes.push({ text, time: new Date().toLocaleString('en-US') });
  localStorage.setItem('vhs_notes', JSON.stringify(notes));
  renderNotebook();
}
function renderNotebook() {
  const panel = $('.notebook-panel');
  if (!panel) return;
  const notes = getNotes();
  if (!notes.length) {
    panel.innerHTML = '<h3>// NOTEBOOK</h3><p style="font-size:0.8rem;color:#6e6b64;">No notes yet. Clues are saved automatically.</p>';
    return;
  }
  panel.innerHTML = '<h3>// NOTEBOOK</h3>' + notes.map(n =>
    `<div class="item">${n.text}<span class="time">${n.time}</span></div>`
  ).join('');
}
function toggleNotebook() { $('.notebook-panel').classList.toggle('open'); }
function doSearch(q) {
  if (!q) return;
  const s = q.toLowerCase().trim();
  const routes = {
    'home': 'home.html', 'intro': 'home.html',
    'about': 'about.html', 'lu yuan': 'about.html', 'luyuan': 'about.html',
    'box': 'box.html', 'tape box': 'box.html', 'serial': 'box.html',
    'tape 1': 'tape-01.html', 'tape 2': 'tape-02.html', 'tape 3': 'tape-03.html',
    'notes': 'notes.html', 'school': 'school.html',
    'forum': 'forum.html', 'news': 'news.html',
    'missing': 'missing.html', 'terminal': 'terminal.html',
    'decode': 'decode.html', 'password': 'decode.html',
    'final': 'final.html', 'last': 'final.html'
  };
  for (const k in routes) {
    if (s.includes(k) || k.includes(s)) { location.href = routes[k]; return; }
  }
  alert('No matching file found. Try "box", "notes", "missing", or "terminal".');
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
