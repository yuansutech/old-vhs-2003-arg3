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
  notes.push({ text, time: new Date().toLocaleString('ja-JP') });
  localStorage.setItem('vhs_notes', JSON.stringify(notes));
  renderNotebook();
}
function renderNotebook() {
  const panel = $('.notebook-panel');
  if (!panel) return;
  const notes = getNotes();
  if (!notes.length) {
    panel.innerHTML = '<h3>// ノート</h3><p style="font-size:0.8rem;color:#6e6b64;">まだ記録がありません。手がかりは自動保存されます。</p>';
    return;
  }
  panel.innerHTML = '<h3>// ノート</h3>' + notes.map(n =>
    `<div class="item">${n.text}<span class="time">${n.time}</span></div>`
  ).join('');
}
function toggleNotebook() { $('.notebook-panel').classList.toggle('open'); }
function doSearch(q) {
  if (!q) return;
  const s = q.toLowerCase().trim();
  const routes = {
    'ホーム': 'home.html', '紹介': 'home.html', 'イントロ': 'home.html',
    'ルー': 'about.html', '陸遠': 'about.html', '情報': 'about.html',
    'テープ': 'box.html', 'ボックス': 'box.html', '番号': 'box.html',
    '第一': 'tape-01.html', '第二': 'tape-02.html', '第三': 'tape-03.html',
    'ノート': 'notes.html', 'メモ': 'notes.html', '学校': 'school.html',
    'フォーラム': 'forum.html', '掲示板': 'forum.html',
    'ニュース': 'news.html', '失踪': 'missing.html', 'ファイル': 'missing.html',
    'ターミナル': 'terminal.html', '解読': 'decode.html', 'パスワード': 'decode.html',
    '最後': 'final.html', '最終': 'final.html'
  };
  for (const k in routes) {
    if (s.includes(k) || k.includes(s)) { location.href = routes[k]; return; }
  }
  alert('該当ファイルが見つかりません。「テープ」「ノート」「失踪」「ターミナル」を試してください。');
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
