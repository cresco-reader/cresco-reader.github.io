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
  document.querySelectorAll('.acct.me').forEach(a => {
    a.querySelector('i').textContent = [...n][0].toUpperCase(); a.querySelector('span').textContent = n; a.title = n + ' — 내 계정';
  });
})();
