/* Portfolio page: showcase completed work, filterable by category */

(function () {
  const grid = document.getElementById("portfolio-grid");
  const pillRow = document.getElementById("portfolio-pills");
  if (!grid) return;

  let activeCat = "all";

  function renderPills() {
    const cats = DataStore.getCategories();
    pillRow.innerHTML = `<button class="cat-pill active" data-cat="all"><i class="fa-solid fa-grip"></i> All Work</button>` +
      cats.map(c => `<button class="cat-pill" data-cat="${c.id}"><i class="${c.icon}"></i> ${c.name}</button>`).join("");
    Utils.qsa("[data-cat]", pillRow).forEach(btn => {
      btn.addEventListener("click", () => {
        activeCat = btn.dataset.cat;
        Utils.qsa("[data-cat]", pillRow).forEach(b => b.classList.toggle("active", b === btn));
        renderGrid();
      });
    });
  }

  function renderGrid() {
    const items = DataStore.getPortfolio().filter(w => activeCat === "all" || w.category === activeCat);
    grid.innerHTML = items.length
      ? items.map(Render.portfolioCard).join("")
      : `<div class="empty-state"><i class="fa-regular fa-folder-open"></i><p>No portfolio items in this category yet.</p></div>`;
  }

  renderPills();
  renderGrid();
})();
