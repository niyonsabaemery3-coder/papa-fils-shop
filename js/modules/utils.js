/* Utility helpers shared across the site */

const Utils = {
  qs(sel, ctx = document) { return ctx.querySelector(sel); },
  qsa(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); },

  genId(prefix = "ID") {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
  },

  formatCurrency(amount, currency = "RWF", locale = "en-RW") {
    try {
      return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
    } catch (e) {
      return `${amount.toLocaleString()} ${currency}`;
    }
  },

  formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  },

  escapeHtml(str = "") {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  debounce(fn, wait = 250) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  },

  initials(name = "") {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("");
  },

  starHtml(rating = 0, max = 5) {
    let html = "";
    for (let i = 1; i <= max; i++) {
      html += `<i class="fa-solid fa-star" style="opacity:${i <= rating ? 1 : 0.25}"></i>`;
    }
    return html;
  },

  validatePhone(phone) {
    const cleaned = phone.replace(/[\s-]/g, "");
    return /^(\+?250)?0?7[0-9]{8}$/.test(cleaned) || /^07[0-9]{8}$/.test(cleaned);
  },

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  waLink(waNumber, text) {
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  }
};
