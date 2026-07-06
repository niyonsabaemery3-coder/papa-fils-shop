/* Shared chrome: navbar, footer, theme toggle, toasts, modal, confirm dialog */

const UI = {
  NAV_ITEMS: [
    { href: "index.html", label: "Home", key: "home" },
    { href: "about.html", label: "About", key: "about" },
    { href: "products.html", label: "Products", key: "products" },
    { href: "portfolio.html", label: "Portfolio", key: "portfolio" },
    { href: "booking.html", label: "Booking", key: "booking" },
    { href: "reviews.html", label: "Reviews", key: "reviews" },
    { href: "contact.html", label: "Contact", key: "contact" }
  ],

  init(activeKey) {
    this._applyStoredTheme();
    this._renderHeader(activeKey);
    this._renderFooter();
    this._wireGlobalWidgets();
    this._hideLoadingScreen();
  },

  /* ---------- Header ---------- */
  _renderHeader(activeKey) {
    const el = document.getElementById("site-header");
    if (!el) return;
    const links = this.NAV_ITEMS.map(item =>
      `<a href="${item.href}" ${item.key === activeKey ? 'aria-current="page"' : ""}>${item.label}</a>`
    ).join("");

    el.innerHTML = `
      <div class="container nav-row">
        <a href="index.html" class="brand">
          <span class="brand-mark">PF</span>
          <span>Papa Fils na Mama Fils<small>Byumba Market Shop</small></span>
        </a>
        <nav class="nav-links" aria-label="Primary">${links}</nav>
        <div class="nav-actions">
          <button class="icon-btn" id="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode">
            <i class="fa-solid fa-moon icon-moon"></i><i class="fa-solid fa-sun icon-sun"></i>
          </button>
          <a class="icon-btn" href="booking.html" aria-label="Book a product" title="Book a product"><i class="fa-regular fa-calendar-check"></i></a>
          <button class="icon-btn nav-toggle" id="mobile-menu-toggle" aria-label="Open menu" aria-expanded="false">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
      <div class="mobile-menu" id="mobile-menu">${links}</div>
    `;

    const toggleBtn = document.getElementById("mobile-menu-toggle");
    const menu = document.getElementById("mobile-menu");
    toggleBtn.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", String(open));
      toggleBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
    Utils.qsa("a", menu).forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));

    document.getElementById("theme-toggle").addEventListener("click", () => this._toggleTheme());
  },

  /* ---------- Footer ---------- */
  _renderFooter() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    const biz = DataStore.getBusiness();
    el.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="brand" style="color:#fff;margin-bottom:14px;">
              <span class="brand-mark">PF</span>
              <span>${biz.shortName}</span>
            </div>
            <p>${Utils.escapeHtml(biz.tagline)}</p>
            <div class="footer-social">
              <a href="${biz.social.facebook}" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="${biz.social.instagram}" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              <a href="${biz.social.twitter}" aria-label="Twitter/X"><i class="fa-brands fa-x-twitter"></i></a>
            </div>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><a href="products.html">Products</a></li>
              <li><a href="portfolio.html">Portfolio</a></li>
              <li><a href="reviews.html">Reviews</a></li>
              <li><a href="about.html">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4>Customer</h4>
            <ul>
              <li><a href="booking.html">Book a Product</a></li>
              <li><a href="products.html">Place an Order</a></li>
              <li><a href="contact.html">Contact Us</a></li>
              <li><a href="admin/login.html">Admin Login</a></li>
            </ul>
          </div>
          <div>
            <h4>Visit Us</h4>
            <ul>
              <li><i class="fa-solid fa-location-dot"></i>&nbsp; ${Utils.escapeHtml(biz.address)}</li>
              <li><i class="fa-solid fa-phone"></i>&nbsp; ${biz.phone}</li>
              <li><i class="fa-regular fa-envelope"></i>&nbsp; ${biz.email}</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} ${biz.name}. All rights reserved.</span>
          <span>Built with care, no backend required.</span>
        </div>
      </div>
    `;
  },

  /* ---------- Theme ---------- */
  _applyStoredTheme() {
    const theme = Storage.get("theme", "light");
    document.documentElement.setAttribute("data-theme", theme);
  },
  _toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    Storage.set("theme", next);
  },

  /* ---------- Loading screen ---------- */
  _hideLoadingScreen() {
    const el = document.getElementById("loading-screen");
    if (!el) return;
    window.addEventListener("load", () => {
      setTimeout(() => el.classList.add("hide"), 250);
    });
    // Fallback in case 'load' already fired
    setTimeout(() => el.classList.add("hide"), 1800);
  },

  /* ---------- Back-to-top + WhatsApp FAB + scroll shadow ---------- */
  _wireGlobalWidgets() {
    const btt = document.getElementById("back-to-top");
    if (btt) {
      window.addEventListener("scroll", Utils.debounce(() => {
        btt.classList.toggle("show", window.scrollY > 500);
      }, 80));
      btt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
  },

  /* ---------- Toasts ---------- */
  toast(message, type = "success", duration = 3500) {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    const icon = type === "success" ? "fa-circle-check" : type === "error" ? "fa-circle-exclamation" : "fa-circle-info";
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="fa-solid ${icon}"></i><span class="msg">${Utils.escapeHtml(message)}</span>`;
    stack.appendChild(el);
    setTimeout(() => {
      el.style.transition = "opacity .25s ease, transform .25s ease";
      el.style.opacity = "0";
      el.style.transform = "translateX(20px)";
      setTimeout(() => el.remove(), 260);
    }, duration);
  },

  /* ---------- Confirm dialog (returns a Promise<boolean>) ---------- */
  confirm(message, { title = "Please confirm", confirmLabel = "Yes, continue", danger = true } = {}) {
    return new Promise(resolve => {
      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";
      overlay.innerHTML = `
        <div class="modal" role="alertdialog" aria-modal="true">
          <h3>${Utils.escapeHtml(title)}</h3>
          <p>${Utils.escapeHtml(message)}</p>
          <div style="display:flex; gap:12px; margin-top:20px;">
            <button class="btn btn-outline btn-block" data-act="cancel">Cancel</button>
            <button class="btn ${danger ? "btn-danger" : "btn-dark"} btn-block" data-act="ok">${confirmLabel}</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);
      requestAnimationFrame(() => overlay.classList.add("open"));
      const close = (result) => {
        overlay.classList.remove("open");
        setTimeout(() => overlay.remove(), 200);
        resolve(result);
      };
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close(false);
        const act = e.target.closest("[data-act]")?.dataset.act;
        if (act === "ok") close(true);
        if (act === "cancel") close(false);
      });
    });
  },

  /* ---------- Generic modal ---------- */
  openModal(innerHtml, { id = "generic-modal" } = {}) {
    this.closeModal(id);
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = id;
    overlay.innerHTML = `<div class="modal">${innerHtml}</div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("open"));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) this.closeModal(id); });
    Utils.qsa("[data-close-modal]", overlay).forEach(b => b.addEventListener("click", () => this.closeModal(id)));
    return overlay;
  },
  closeModal(id = "generic-modal") {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove("open");
    setTimeout(() => overlay.remove(), 200);
  }
};
