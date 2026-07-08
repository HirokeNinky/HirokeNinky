/* ===== ADMIN LOGIN LOGIC (API version) =====
   Uses a real server-side session (httpOnly cookie) — no passwords
   ever touch localStorage or client-side JS in this version. */
(function(){
  document.addEventListener('DOMContentLoaded', async () => {
    // already logged in? go straight to dashboard
    try{
      const s = await apiGet('/auth/session');
      if(s.loggedIn){ window.location.href = 'admin-dashboard.html'; return; }
    }catch(e){ /* ignore, show login form */ }

    const form = document.getElementById('login-form');
    const errBox = document.getElementById('login-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = document.getElementById('login-user').value.trim();
      const pass = document.getElementById('login-pass').value;

      const res = await apiPost('/auth/login', { user, pass });
      if(res.ok){
        window.location.href = 'admin-dashboard.html';
      }else{
        errBox.textContent = res.data.error || 'Username atau password salah. Rift menolak masuk.';
        errBox.hidden = false;
      }
    });
  });
})();
