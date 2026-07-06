/* Home page: featured products, animated stats, review preview, category shortcuts */

(function () {
  // Featured products
  const featuredGrid = document.getElementById("featured-grid");
  if (featuredGrid) {
    const featured = DataStore.getFeaturedProducts().slice(0, 4);
    featuredGrid.innerHTML = featured.map(Render.productCard).join("");
    featuredGrid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      if (btn.dataset.action === "order") {
        DataStore.addToCart(btn.dataset.id, 1);
        UI.toast("Added to your order. Visit the Order page to review & send it.", "success");
      }
      if (btn.dataset.action === "view") location.href = `products.html`;
    });
  }

  // Category shortcuts
  const catRow = document.getElementById("home-category-row");
  if (catRow) {
    const cats = DataStore.getCategories();
    catRow.innerHTML = cats.map(c => `
      <a class="card why-card" href="products.html?category=${c.id}">
        <i class="${c.icon}"></i>
        <h3>${c.name}</h3>
        <p>${c.description}</p>
      </a>`).join("");
  }

  // Stats counters
  const statsStrip = document.getElementById("stats-strip");
  if (statsStrip) {
    const biz = DataStore.getBusiness();
    statsStrip.innerHTML = biz.stats.map((s, i) => `
      <div class="stat-card">
        <div class="num" data-count="${s.value}" data-suffix="${s.suffix}">0</div>
        <div class="label">${s.label}</div>
      </div>`).join("");
    const nums = Utils.qsa("[data-count]", statsStrip);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    nums.forEach(n => observer.observe(n));
  }

  function animateCount(el) {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Reviews preview
  const reviewPreview = document.getElementById("home-reviews-grid");
  if (reviewPreview) {
    const reviews = DataStore.getReviews().slice(0, 3);
    reviewPreview.innerHTML = reviews.map(r => Render.reviewCard(r, false)).join("");
  }
})();
