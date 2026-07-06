/* Products page: live search, category filter, price sort, detail modal, add-to-order */

(function () {
  const grid = document.getElementById("products-grid");
  const emptyState = document.getElementById("products-empty");
  const searchInput = document.getElementById("product-search");
  const sortSelect = document.getElementById("product-sort");
  const pillRow = document.getElementById("category-pills");
  const resultCount = document.getElementById("result-count");

  if (!grid) return;

  const state = { query: "", category: "all", sort: "default" };

  // Pre-select category from ?category= query param (used by home page category links)
  const params = new URLSearchParams(location.search);
  if (params.get("category")) state.category = params.get("category");
  if (params.get("q")) state.query = params.get("q");

  function renderPills() {
    const cats = DataStore.getCategories();
    const allPill = `<button class="cat-pill ${state.category === "all" ? "active" : ""}" data-cat="all"><i class="fa-solid fa-grip"></i> All</button>`;
    const pills = cats.map(c => `<button class="cat-pill ${state.category === c.id ? "active" : ""}" data-cat="${c.id}"><i class="${c.icon}"></i> ${c.name}</button>`).join("");
    pillRow.innerHTML = allPill + pills;
    Utils.qsa("[data-cat]", pillRow).forEach(btn => {
      btn.addEventListener("click", () => {
        state.category = btn.dataset.cat;
        renderPills();
        renderGrid();
      });
    });
  }

  function renderGrid() {
    const items = DataStore.searchProducts(state);
    resultCount.textContent = `${items.length} product${items.length === 1 ? "" : "s"} found`;
    if (!items.length) {
      grid.innerHTML = "";
      emptyState.style.display = "block";
      return;
    }
    emptyState.style.display = "none";
    grid.innerHTML = items.map(Render.productCard).join("");
  }

  searchInput.value = state.query;
  searchInput.addEventListener("input", Utils.debounce(() => {
    state.query = searchInput.value.trim();
    renderGrid();
  }, 200));

  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    renderGrid();
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === "view") openDetailModal(id);
    if (btn.dataset.action === "order") quickAddToOrder(id);
  });

  function quickAddToOrder(id) {
    DataStore.addToCart(id, 1);
    UI.toast("Added to your order. Visit the Order page to review & send it.", "success");
    updateCartBadge();
  }

  function openDetailModal(id) {
    const p = DataStore.getProduct(id);
    if (!p) return;
    const cat = DataStore.getCategory(p.category);
    UI.openModal(`
      <button class="icon-btn modal-close" data-close-modal><i class="fa-solid fa-xmark"></i></button>
      <img src="${p.image}" alt="${Utils.escapeHtml(p.name)}" style="border-radius:14px;width:100%;aspect-ratio:4/3;object-fit:cover;margin-bottom:18px;">
      <span class="tag tag--indigo">${cat ? cat.name : p.category}</span>
      <h3 style="margin-top:12px;">${Utils.escapeHtml(p.name)}</h3>
      <p>${Utils.escapeHtml(p.description)}</p>
      <div class="price" style="font-size:22px;margin-bottom:16px;">${Utils.formatCurrency(p.price)}</div>
      <div style="display:flex; gap:12px;">
        <a href="booking.html?product=${p.id}" class="btn btn-outline btn-block"><i class="fa-regular fa-calendar-check"></i> Book</a>
        <button class="btn btn-primary btn-block" data-close-modal data-order-id="${p.id}" ${p.availability ? "" : "disabled"}>
          <i class="fa-solid fa-cart-plus"></i> Add to Order
        </button>
      </div>
    `);
    document.getElementById("generic-modal").addEventListener("click", (e) => {
      const orderBtn = e.target.closest("[data-order-id]");
      if (orderBtn) quickAddToOrder(orderBtn.dataset.orderId);
    });
  }

  function updateCartBadge() {
    const badge = document.getElementById("cart-count-badge");
    if (badge) badge.textContent = DataStore.cartCount();
  }

  renderPills();
  renderGrid();
  updateCartBadge();
})();
