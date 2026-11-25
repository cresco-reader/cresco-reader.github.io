// 로그인 표시 — 계정 화면(fly.dev/account)은 로그인하면 ?r= 로 받은 이 사이트 주소로 #hi=이름 을 붙여 돌려보내고,
// 로그아웃하면 #bye 로 보낸다. 여기엔 이름만 둔다(로그인 표는 계정 화면에만). 표가 끝났으면 계정 화면이 로그인을 다시 묻는다.
(() => {
  const A = 'https://cresco-reader-api.fly.dev/account', K = 'cresco-who', h = location.hash, mark = h.startsWith('#hi=') || h === '#bye';
  let n = '';
  try {
    if (h.startsWith('#hi=')) localStorage.setItem(K, decodeURIComponent(h.slice(4)).slice(0, 40));
    if (h === '#bye') localStorage.removeItem(K);
    n = localStorage.getItem(K) || '';
  } catch (e) { /* 저장을 못 하면 늘 로그인 단추 */ }
  if (mark) history.replaceState(null, '', location.pathname + location.search);
  // 로그인 · 회원가입 단추는 끝나면 이 쪽으로 돌아온다
  document.querySelectorAll(`a[href^="${A}"]:not([data-in] a):not([data-in])`).forEach(a => {
    const u = new URL(a.href); u.searchParams.set('r', location.pathname); a.href = u;
  });
  if (!n) return;
  document.querySelectorAll('[data-out]').forEach(e => { e.hidden = true; });
  document.querySelectorAll('[data-in]').forEach(e => { e.hidden = false; });
  // 이름 단추 → 펼침 메뉴(내 계정 · 요금제 · 로그아웃). 바탕이 밝은 홈 머리와 어두운 프로그램 머리 모두에 맞게 메뉴는 흰 판
  const st = document.createElement('style');
  st.textContent = `.who-m{position:relative;margin-left:auto}.who-m summary{list-style:none;cursor:pointer}.who-m summary::-webkit-details-marker{display:none}
.who-p{position:absolute;right:0;top:calc(100% + 8px);z-index:50;min-width:190px;padding:6px;background:#fff;color:#1b1410;border:1px solid rgba(0,0,0,.1);border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,.18);font:500 14px/1.4 system-ui,sans-serif;text-align:left}
.who-p b{display:block;padding:8px 12px 10px;border-bottom:1px solid rgba(0,0,0,.08);margin-bottom:4px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.who-p a{display:block;padding:8px 12px;border-radius:8px;color:inherit;text-decoration:none;opacity:1}.who-p a:hover{background:rgba(0,0,0,.05);text-decoration:none}
.who-p .out{color:#b3261e;border-top:1px solid rgba(0,0,0,.08);border-radius:0 0 8px 8px;margin-top:4px}`;
  document.head.append(st);
  const r = encodeURIComponent(location.pathname);
  document.querySelectorAll('.acct.me').forEach(a => {
    const d = document.createElement('details'); d.className = 'who-m';
    d.innerHTML = `<summary class="${a.className}" aria-label="내 계정 메뉴"><i></i><span></span></summary>
      <div class="who-p" role="menu"><b></b><a role="menuitem" href="${A}">내 계정</a><a role="menuitem" href="${A}#billing">요금제 · 결제</a>
      <a role="menuitem" class="out" href="${A}?logout=1&r=${r}">로그아웃</a></div>`;
    d.querySelector('i').textContent = [...n][0].toUpperCase(); d.querySelector('span').textContent = d.querySelector('b').textContent = n;
    a.replaceWith(d);
  });
  // 바깥을 누르거나 Esc 면 닫는다
  document.addEventListener('click', e => document.querySelectorAll('.who-m[open]').forEach(d => d.contains(e.target) || d.removeAttribute('open')));
  document.addEventListener('keydown', e => e.key === 'Escape' && document.querySelectorAll('.who-m[open]').forEach(d => d.removeAttribute('open')));
})();
