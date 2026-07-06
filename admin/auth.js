/**
 * Admin authentication
 * ---------------------
 * NOTE: This is a client-side-only demo login intended for a no-backend
 * project. Credentials live in Settings (localStorage) and the "session"
 * is just a sessionStorage flag. This is NOT secure for a real production
 * admin panel handling sensitive data — it only prevents casual browsing
 * of the dashboard by someone without the password.
 */

const AdminAuth = {
  SESSION_KEY: "pfmf_admin_session",

  isLoggedIn() {
    return sessionStorage.getItem(this.SESSION_KEY) === "true";
  },
  login(username, password) {
    const settings = DataStore.getSettings();
    if (username === settings.admin.username && password === settings.admin.password) {
      sessionStorage.setItem(this.SESSION_KEY, "true");
      return true;
    }
    return false;
  },
  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    location.href = "login.html";
  },
  requireLogin() {
    if (!this.isLoggedIn()) location.href = "login.html";
  }
};

(function () {
  const form = document.getElementById("admin-login-form");
  if (!form) return;
  if (AdminAuth.isLoggedIn()) { location.href = "dashboard.html"; return; }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = form.adminUsername.value.trim();
    const password = form.adminPassword.value;
    const errorEl = document.getElementById("login-error");
    if (AdminAuth.login(username, password)) {
      location.href = "dashboard.html";
    } else {
      errorEl.style.display = "flex";
      form.adminPassword.value = "";
    }
  });
})();
