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
  notes.push({ text, time: new Date().toLocaleString('ko-KR') });
  localStorage.setItem('vhs_notes', JSON.stringify(notes));
  renderNotebook();
}
function renderNotebook() {
  const panel = $('.notebook-panel');
  if (!panel) return;
  const notes = getNotes();
  if (!notes.length) {
    panel.innerHTML = '<h3>// 노트</h3><p style="font-size:0.8rem;color:#6e6b64;">아직 기록이 없습니다. 단서는 자동 저장됩니다.</p>';
    return;
  }
  panel.innerHTML = '<h3>// 노트</h3>' + notes.map(n =>
    `<div class="item">${n.text}<span class="time">${n.time}</span></div>`
  ).join('');
}
function toggleNotebook() { $('.notebook-panel').classList.toggle('open'); }
function doSearch(q) {
  if (!q) return;
  const s = q.toLowerCase().trim();
  const routes = {
    '홈': 'home.html', '소개': 'home.html', '인트로': 'home.html',
    '루위안': 'about.html', '정보': 'about.html',
    '테이프': 'box.html', '박스': 'box.html', '번호': 'box.html',
    '첫번째': 'tape-01.html', '두번째': 'tape-02.html', '세번째': 'tape-03.html',
    '노트': 'notes.html', '메모': 'notes.html', '학교': 'school.html',
    '포럼': 'forum.html', '게시판': 'forum.html',
    '뉴스': 'news.html', '실종': 'missing.html', '파일': 'missing.html',
    '터미널': 'terminal.html', '해독': 'decode.html', '비밀번호': 'decode.html',
    '마지막': 'final.html', '최종': 'final.html'
  };
  for (const k in routes) {
    if (s.includes(k) || k.includes(s)) { location.href = routes[k]; return; }
  }
  alert('해당 파일을 찾을 수 없습니다. "테이프", "노트", "실종", "터미널"을 시도해보세요.');
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
