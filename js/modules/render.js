/* Reusable card renderers shared between the home, products, portfolio and reviews pages */

const Render = {
  productCard(p) {
    const cat = DataStore.getCategory(p.category);
    return `
      <article class="card product-card" data-id="${p.id}">
        <div class="thumb">
          <img src="${p.image}" alt="${Utils.escapeHtml(p.name)}" loading="lazy" width="600" height="480">
          <span class="tag">${cat ? cat.name : p.category}</span>
          <span class="tag avail-tag ${p.availability ? "tag--green" : ""}" style="${p.availability ? "" : "background:#f2e4de;color:#B3402A;"}">
            ${p.availability ? "In stock" : "Sold out"}
          </span>
        </div>
        <div class="body">
          <span class="cat">${cat ? cat.name : p.category}</span>
          <h3>${Utils.escapeHtml(p.name)}</h3>
          <p class="desc">${Utils.escapeHtml(p.description)}</p>
          <div class="price-row">
            <span class="price">${Utils.formatCurrency(p.price)}</span>
          </div>
          <div class="actions">
            <button class="btn btn-outline btn-sm" data-action="view" data-id="${p.id}"><i class="fa-regular fa-eye"></i> View</button>
            <button class="btn btn-primary btn-sm" data-action="order" data-id="${p.id}" ${p.availability ? "" : "disabled"}>
              <i class="fa-solid fa-cart-plus"></i> Order
            </button>
          </div>
        </div>
      </article>`;
  },

  portfolioCard(w) {
    const cat = DataStore.getCategory(w.category);
    return `
      <article class="card" data-id="${w.id}">
        <div class="thumb" style="aspect-ratio:4/3;">
          <img src="${w.image}" alt="${Utils.escapeHtml(w.title)}" loading="lazy" width="600" height="450">
          <span class="tag tag--indigo">${cat ? cat.name : w.category}</span>
        </div>
        <div class="body">
          <h3 style="font-size:17px;">${Utils.escapeHtml(w.title)}</h3>
          <p class="desc">${Utils.escapeHtml(w.description)}</p>
        </div>
      </article>`;
  },

  reviewCard(r, isMine) {
    return `
      <article class="card review-card" data-id="${r.id}">
        <div class="stars">${Utils.starHtml(r.rating)}</div>
        <p>"${Utils.escapeHtml(r.comment)}"</p>
        <div class="who">
          <div class="avatar">${Utils.initials(r.name)}</div>
          <div>
            <strong>${Utils.escapeHtml(r.name)}</strong>
            <span>${Utils.formatDate(r.date)}</span>
          </div>
        </div>
        ${isMine ? `
        <div class="review-actions">
          <button class="btn btn-outline btn-sm" data-action="edit-review" data-id="${r.id}"><i class="fa-solid fa-pen"></i> Edit</button>
          <button class="btn btn-outline btn-sm" data-action="delete-review" data-id="${r.id}"><i class="fa-solid fa-trash"></i> Delete</button>
        </div>` : ""}
      </article>`;
  }
};
