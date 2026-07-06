/* Admin dashboard: single-page shell, section router, full CRUD */

(function () {
  AdminAuth.requireLogin();

  const views = Utils.qsa(".admin-view");
  const navLinks = Utils.qsa(".admin-nav a[data-view]");

  function showView(name) {
    views.forEach(v => v.classList.toggle("active", v.id === `view-${name}`));
    navLinks.forEach(l => l.classList.toggle("active", l.dataset.view === name));
    document.getElementById("admin-page-title").textContent = name.charAt(0).toUpperCase() + name.slice(1);
    renderView(name);
    document.getElementById("admin-mobile-menu")?.classList.remove("open");
  }
  navLinks.forEach(l => l.addEventListener("click", (e) => { e.preventDefault(); showView(l.dataset.view); }));
  document.getElementById("admin-logout")?.addEventListener("click", () => AdminAuth.logout());

  function renderView(name) {
    const fns = {
      dashboard: renderDashboard, products: renderProducts, bookings: renderBookings,
      orders: renderOrders, reviews: renderReviews, portfolio: renderPortfolio,
      messages: renderMessages, settings: renderSettings, statistics: renderStatistics
    };
    (fns[name] || renderDashboard)();
  }

  /* ================= DASHBOARD ================= */
  function renderDashboard() {
    const s = DataStore.getDashboardStats();
    document.getElementById("view-dashboard").innerHTML = `
      <div class="kpi-grid">
        ${kpi("fa-solid fa-box", s.products, "Products in catalogue")}
        ${kpi("fa-regular fa-calendar-check", s.pendingBookings, "Pending bookings")}
        ${kpi("fa-solid fa-cart-shopping", s.pendingOrders, "Pending orders")}
        ${kpi("fa-solid fa-star", s.avgRating, "Average rating · " + s.reviews + " reviews")}
      </div>
      <div class="admin-panel">
        <div class="panel-head"><h2>Recent Bookings</h2><a href="#" data-view="bookings" class="btn btn-outline btn-sm">View all</a></div>
        <div class="panel-body">${bookingsTable(DataStore.getBookings().slice(0, 5))}</div>
      </div>
      <div class="admin-panel">
        <div class="panel-head"><h2>Recent Orders</h2><a href="#" data-view="orders" class="btn btn-outline btn-sm">View all</a></div>
        <div class="panel-body">${ordersTable(DataStore.getOrders().slice(0, 5))}</div>
      </div>
      <div class="admin-panel">
        <div class="panel-head"><h2>Recent Messages</h2><a href="#" data-view="messages" class="btn btn-outline btn-sm">View all</a></div>
        <div class="panel-body">${messagesTable(DataStore.getMessages().slice(0, 5))}</div>
      </div>
    `;
    Utils.qsa("[data-view]", document.getElementById("view-dashboard")).forEach(a =>
      a.addEventListener("click", (e) => { e.preventDefault(); showView(a.dataset.view); }));
  }
  function kpi(icon, num, label) {
    return `<div class="kpi-card"><div class="top"><i class="${icon}"></i></div><div class="num">${num}</div><div class="label">${label}</div></div>`;
  }

  /* ================= PRODUCTS ================= */
  function renderProducts() {
    const products = DataStore.getProducts();
    document.getElementById("view-products").innerHTML = `
      <div class="admin-panel">
        <div class="panel-head">
          <h2>Products (${products.length})</h2>
          <button class="btn btn-primary btn-sm" id="add-product-btn"><i class="fa-solid fa-plus"></i> Add Product</button>
        </div>
        <div class="panel-body">
          <table class="admin-table">
            <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th>Featured</th><th></th></tr></thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td><img class="thumb-sm" src="${p.image}" alt=""></td>
                  <td>${Utils.escapeHtml(p.name)}</td>
                  <td>${DataStore.getCategory(p.category)?.name || p.category}</td>
                  <td>${Utils.formatCurrency(p.price)}</td>
                  <td><span class="status-pill ${p.availability ? "in" : "out"}">${p.availability ? "In stock" : "Sold out"}</span></td>
                  <td>${p.featured ? '<i class="fa-solid fa-star" style="color:var(--gold)"></i>' : "—"}</td>
                  <td class="row-actions">
                    <button data-edit="${p.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button data-delete="${p.id}" class="danger" title="Delete"><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>`).join("")}
            </tbody>
          </table>
          ${!products.length ? emptyRow("No products yet.") : ""}
        </div>
      </div>
    `;
    document.getElementById("add-product-btn").addEventListener("click", () => openProductModal());
    Utils.qsa("[data-edit]").forEach(b => b.addEventListener("click", () => openProductModal(b.dataset.edit)));
    Utils.qsa("[data-delete]").forEach(b => b.addEventListener("click", async () => {
      const ok = await UI.confirm("This product will be permanently removed from the catalogue.", { title: "Delete product?", confirmLabel: "Delete" });
      if (ok) { DataStore.deleteProduct(b.dataset.delete); renderProducts(); UI.toast("Product deleted.", "success"); }
    }));
  }

  function openProductModal(id) {
    const editing = id ? DataStore.getProduct(id) : null;
    const cats = DataStore.getCategories();
    UI.openModal(`
      <button class="icon-btn modal-close" data-close-modal><i class="fa-solid fa-xmark"></i></button>
      <h3>${editing ? "Edit Product" : "Add Product"}</h3>
      <form id="product-form">
        <div class="field"><label>Product Name</label><input name="name" required value="${editing ? Utils.escapeHtml(editing.name) : ""}"></div>
        <div class="field"><label>Category</label>
          <select name="category" required>
            ${cats.map(c => `<option value="${c.id}" ${editing?.category === c.id ? "selected" : ""}>${c.name}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label>Price (RWF)</label><input name="price" type="number" min="0" required value="${editing ? editing.price : ""}"></div>
        <div class="field"><label>Image path</label><input name="image" required value="${editing ? editing.image : "assets/images/"}"></div>
        <div class="field"><label>Description</label><textarea name="description" required>${editing ? Utils.escapeHtml(editing.description) : ""}</textarea></div>
        <div class="field" style="flex-direction:row; align-items:center; gap:10px;">
          <input type="checkbox" name="availability" id="pf-avail" style="width:auto;" ${!editing || editing.availability ? "checked" : ""}>
          <label for="pf-avail" style="margin:0;">In stock</label>
        </div>
        <div class="field" style="flex-direction:row; align-items:center; gap:10px;">
          <input type="checkbox" name="featured" id="pf-feat" style="width:auto;" ${editing?.featured ? "checked" : ""}>
          <label for="pf-feat" style="margin:0;">Show on homepage (featured)</label>
        </div>
        <button type="submit" class="btn btn-primary btn-block">${editing ? "Save Changes" : "Add Product"}</button>
      </form>
    `);
    document.getElementById("product-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      const data = {
        name: f.name.value.trim(), category: f.category.value, price: Number(f.price.value),
        image: f.image.value.trim(), description: f.description.value.trim(),
        availability: f.availability.checked, featured: f.featured.checked
      };
      if (editing) DataStore.updateProduct(editing.id, data); else DataStore.addProduct(data);
      UI.closeModal();
      renderProducts();
      UI.toast(editing ? "Product updated." : "Product added.", "success");
    });
  }

  /* ================= BOOKINGS ================= */
  function bookingsTable(items) {
    if (!items.length) return emptyRow("No bookings yet.");
    return `<table class="admin-table"><thead><tr><th>Product</th><th>Customer</th><th>Phone</th><th>Qty</th><th>Status</th><th></th></tr></thead><tbody>
      ${items.map(b => `
        <tr>
          <td>${Utils.escapeHtml(b.productName)}</td>
          <td>${Utils.escapeHtml(b.customerName)}</td>
          <td>${b.customerPhone}</td>
          <td>${b.quantity}</td>
          <td><select class="select-inline" data-status-booking="${b.id}">
            ${["pending", "confirmed", "cancelled"].map(s => `<option value="${s}" ${b.status === s ? "selected" : ""}>${s}</option>`).join("")}
          </select></td>
          <td class="row-actions"><button class="danger" data-delete-booking="${b.id}"><i class="fa-solid fa-trash"></i></button></td>
        </tr>`).join("")}
    </tbody></table>`;
  }
  function renderBookings() {
    const items = DataStore.getBookings();
    document.getElementById("view-bookings").innerHTML = `
      <div class="admin-panel"><div class="panel-head"><h2>Bookings (${items.length})</h2></div>
      <div class="panel-body">${bookingsTable(items)}</div></div>`;
    wireBookingRows();
  }
  function wireBookingRows() {
    Utils.qsa("[data-status-booking]").forEach(sel => sel.addEventListener("change", () => {
      DataStore.updateBookingStatus(sel.dataset.statusBooking, sel.value);
      UI.toast("Booking status updated.", "success");
    }));
    Utils.qsa("[data-delete-booking]").forEach(btn => btn.addEventListener("click", async () => {
      const ok = await UI.confirm("This booking will be permanently removed.", { title: "Delete booking?", confirmLabel: "Delete" });
      if (ok) { DataStore.deleteBooking(btn.dataset.deleteBooking); renderBookings(); UI.toast("Booking deleted.", "success"); }
    }));
  }

  /* ================= ORDERS ================= */
  function ordersTable(items) {
    if (!items.length) return emptyRow("No orders yet.");
    return `<table class="admin-table"><thead><tr><th>Customer</th><th>Phone</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>
      ${items.map(o => `
        <tr>
          <td>${Utils.escapeHtml(o.customerName)}</td>
          <td>${o.customerPhone}</td>
          <td>${o.items.map(i => `${i.qty}× ${Utils.escapeHtml(i.name)}`).join(", ")}</td>
          <td>${Utils.formatCurrency(o.total)}</td>
          <td><select class="select-inline" data-status-order="${o.id}">
            ${["pending", "confirmed", "delivered", "cancelled"].map(s => `<option value="${s}" ${o.status === s ? "selected" : ""}>${s}</option>`).join("")}
          </select></td>
          <td class="row-actions"><button class="danger" data-delete-order="${o.id}"><i class="fa-solid fa-trash"></i></button></td>
        </tr>`).join("")}
    </tbody></table>`;
  }
  function renderOrders() {
    const items = DataStore.getOrders();
    document.getElementById("view-orders").innerHTML = `
      <div class="admin-panel"><div class="panel-head"><h2>Orders (${items.length})</h2></div>
      <div class="panel-body">${ordersTable(items)}</div></div>`;
    Utils.qsa("[data-status-order]").forEach(sel => sel.addEventListener("change", () => {
      DataStore.updateOrderStatus(sel.dataset.statusOrder, sel.value);
      UI.toast("Order status updated.", "success");
    }));
    Utils.qsa("[data-delete-order]").forEach(btn => btn.addEventListener("click", async () => {
      const ok = await UI.confirm("This order will be permanently removed.", { title: "Delete order?", confirmLabel: "Delete" });
      if (ok) { DataStore.deleteOrder(btn.dataset.deleteOrder); renderOrders(); UI.toast("Order deleted.", "success"); }
    }));
  }

  /* ================= REVIEWS ================= */
  function renderReviews() {
    const items = DataStore.getReviews();
    document.getElementById("view-reviews").innerHTML = `
      <div class="admin-panel"><div class="panel-head"><h2>Reviews (${items.length})</h2></div>
      <div class="panel-body">
        <table class="admin-table"><thead><tr><th>Name</th><th>Rating</th><th>Comment</th><th>Date</th><th></th></tr></thead><tbody>
        ${items.map(r => `
          <tr>
            <td>${Utils.escapeHtml(r.name)}</td>
            <td>${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</td>
            <td style="max-width:320px;">${Utils.escapeHtml(r.comment)}</td>
            <td>${Utils.formatDate(r.date)}</td>
            <td class="row-actions"><button class="danger" data-delete-review="${r.id}"><i class="fa-solid fa-trash"></i></button></td>
          </tr>`).join("")}
        </tbody></table>
        ${!items.length ? emptyRow("No reviews yet.") : ""}
      </div></div>`;
    Utils.qsa("[data-delete-review]").forEach(btn => btn.addEventListener("click", async () => {
      const ok = await UI.confirm("This review will be permanently removed.", { title: "Delete review?", confirmLabel: "Delete" });
      if (ok) { DataStore.deleteReview(btn.dataset.deleteReview); renderReviews(); UI.toast("Review deleted.", "success"); }
    }));
  }

  /* ================= PORTFOLIO ================= */
  function renderPortfolio() {
    const items = DataStore.getPortfolio();
    document.getElementById("view-portfolio").innerHTML = `
      <div class="admin-panel">
        <div class="panel-head"><h2>Portfolio (${items.length})</h2>
          <button class="btn btn-primary btn-sm" id="add-portfolio-btn"><i class="fa-solid fa-plus"></i> Add Item</button>
        </div>
        <div class="panel-body">
          <table class="admin-table"><thead><tr><th></th><th>Title</th><th>Category</th><th>Description</th><th></th></tr></thead><tbody>
          ${items.map(w => `
            <tr>
              <td><img class="thumb-sm" src="${w.image}" alt=""></td>
              <td>${Utils.escapeHtml(w.title)}</td>
              <td>${DataStore.getCategory(w.category)?.name || w.category}</td>
              <td style="max-width:280px;">${Utils.escapeHtml(w.description)}</td>
              <td class="row-actions">
                <button data-edit-portfolio="${w.id}"><i class="fa-solid fa-pen"></i></button>
                <button class="danger" data-delete-portfolio="${w.id}"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>`).join("")}
          </tbody></table>
          ${!items.length ? emptyRow("No portfolio items yet.") : ""}
        </div>
      </div>`;
    document.getElementById("add-portfolio-btn").addEventListener("click", () => openPortfolioModal());
    Utils.qsa("[data-edit-portfolio]").forEach(b => b.addEventListener("click", () => openPortfolioModal(b.dataset.editPortfolio)));
    Utils.qsa("[data-delete-portfolio]").forEach(b => b.addEventListener("click", async () => {
      const ok = await UI.confirm("This portfolio item will be permanently removed.", { title: "Delete item?", confirmLabel: "Delete" });
      if (ok) { DataStore.deletePortfolio(b.dataset.deletePortfolio); renderPortfolio(); UI.toast("Portfolio item deleted.", "success"); }
    }));
  }
  function openPortfolioModal(id) {
    const editing = id ? DataStore.getPortfolio().find(w => w.id === id) : null;
    const cats = DataStore.getCategories();
    UI.openModal(`
      <button class="icon-btn modal-close" data-close-modal><i class="fa-solid fa-xmark"></i></button>
      <h3>${editing ? "Edit Portfolio Item" : "Add Portfolio Item"}</h3>
      <form id="portfolio-form">
        <div class="field"><label>Title</label><input name="title" required value="${editing ? Utils.escapeHtml(editing.title) : ""}"></div>
        <div class="field"><label>Category</label>
          <select name="category" required>${cats.map(c => `<option value="${c.id}" ${editing?.category === c.id ? "selected" : ""}>${c.name}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Image path</label><input name="image" required value="${editing ? editing.image : "assets/images/"}"></div>
        <div class="field"><label>Description</label><textarea name="description" required>${editing ? Utils.escapeHtml(editing.description) : ""}</textarea></div>
        <button type="submit" class="btn btn-primary btn-block">${editing ? "Save Changes" : "Add Item"}</button>
      </form>
    `);
    document.getElementById("portfolio-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      const data = { title: f.title.value.trim(), category: f.category.value, image: f.image.value.trim(), description: f.description.value.trim() };
      if (editing) DataStore.updatePortfolio(editing.id, data); else DataStore.addPortfolio(data);
      UI.closeModal();
      renderPortfolio();
      UI.toast(editing ? "Portfolio item updated." : "Portfolio item added.", "success");
    });
  }

  /* ================= MESSAGES ================= */
  function messagesTable(items) {
    if (!items.length) return emptyRow("No messages yet.");
    return `<table class="admin-table"><thead><tr><th>Name</th><th>Contact</th><th>Subject</th><th>Date</th><th></th></tr></thead><tbody>
      ${items.map(m => `
        <tr style="${m.read ? "" : "font-weight:700;"}">
          <td>${Utils.escapeHtml(m.name)}</td>
          <td>${m.phone || ""} ${m.email ? "· " + Utils.escapeHtml(m.email) : ""}</td>
          <td>${Utils.escapeHtml(m.subject || "General enquiry")}</td>
          <td>${Utils.formatDate(m.createdAt)}</td>
          <td class="row-actions">
            <button data-view-message="${m.id}"><i class="fa-regular fa-eye"></i></button>
            <button class="danger" data-delete-message="${m.id}"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>`).join("")}
    </tbody></table>`;
  }
  function renderMessages() {
    const items = DataStore.getMessages();
    document.getElementById("view-messages").innerHTML = `
      <div class="admin-panel"><div class="panel-head"><h2>Messages (${items.length})</h2></div>
      <div class="panel-body">${messagesTable(items)}</div></div>`;
    Utils.qsa("[data-view-message]").forEach(b => b.addEventListener("click", () => {
      const m = DataStore.getMessages().find(x => x.id === b.dataset.viewMessage);
      DataStore.markMessageRead(m.id);
      UI.openModal(`
        <button class="icon-btn modal-close" data-close-modal><i class="fa-solid fa-xmark"></i></button>
        <h3>${Utils.escapeHtml(m.subject || "General enquiry")}</h3>
        <p><strong>${Utils.escapeHtml(m.name)}</strong> · ${m.phone || ""} ${m.email ? "· " + Utils.escapeHtml(m.email) : ""}</p>
        <p>${Utils.escapeHtml(m.message)}</p>
      `);
      renderMessages();
    }));
    Utils.qsa("[data-delete-message]").forEach(b => b.addEventListener("click", async () => {
      const ok = await UI.confirm("This message will be permanently removed.", { title: "Delete message?", confirmLabel: "Delete" });
      if (ok) { DataStore.deleteMessage(b.dataset.deleteMessage); renderMessages(); UI.toast("Message deleted.", "success"); }
    }));
  }

  /* ================= SETTINGS ================= */
  function renderSettings() {
    const biz = DataStore.getBusiness();
    const settings = DataStore.getSettings();
    document.getElementById("view-settings").innerHTML = `
      <div class="admin-panel">
        <div class="panel-head"><h2>Business Information</h2></div>
        <div class="panel-body">
          <form id="business-form">
            <div class="form-grid">
              <div class="field"><label>Business Name</label><input name="name" value="${Utils.escapeHtml(biz.name)}"></div>
              <div class="field"><label>Tagline</label><input name="tagline" value="${Utils.escapeHtml(biz.tagline)}"></div>
              <div class="field full"><label>Address</label><input name="address" value="${Utils.escapeHtml(biz.address)}"></div>
              <div class="field"><label>Phone</label><input name="phone" value="${biz.phone}"></div>
              <div class="field"><label>WhatsApp number (digits only, with country code)</label><input name="whatsapp" value="${biz.whatsapp}"></div>
              <div class="field"><label>Email</label><input name="email" value="${biz.email}"></div>
            </div>
            <button type="submit" class="btn btn-primary">Save Business Info</button>
          </form>
        </div>
      </div>
      <div class="admin-panel">
        <div class="panel-head"><h2>Admin Credentials</h2></div>
        <div class="panel-body">
          <form id="credentials-form">
            <div class="form-grid">
              <div class="field"><label>Username</label><input name="username" value="${settings.admin.username}"></div>
              <div class="field"><label>Password</label><input name="password" type="text" value="${settings.admin.password}"></div>
            </div>
            <button type="submit" class="btn btn-primary">Update Credentials</button>
          </form>
        </div>
      </div>
      <div class="admin-panel">
        <div class="panel-head"><h2>Danger Zone</h2></div>
        <div class="panel-body">
          <p>Reset the entire site back to its original demo data. This clears every product edit, booking, order, review and message stored in this browser.</p>
          <button class="btn btn-danger" id="reset-all-btn"><i class="fa-solid fa-triangle-exclamation"></i> Reset All Data</button>
        </div>
      </div>
    `;
    document.getElementById("business-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      DataStore.updateBusiness({ name: f.name.value, tagline: f.tagline.value, address: f.address.value, phone: f.phone.value, whatsapp: f.whatsapp.value, email: f.email.value });
      UI.toast("Business info updated.", "success");
    });
    document.getElementById("credentials-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      DataStore.updateSettings({ admin: { username: f.username.value, password: f.password.value } });
      UI.toast("Admin credentials updated.", "success");
    });
    document.getElementById("reset-all-btn").addEventListener("click", async () => {
      const ok = await UI.confirm("Everything stored in this browser will be wiped and replaced with the original demo data.", { title: "Reset all data?", confirmLabel: "Reset everything" });
      if (ok) DataStore.resetAll();
    });
  }

  /* ================= STATISTICS ================= */
  function renderStatistics() {
    const products = DataStore.getProducts();
    const cats = DataStore.getCategories();
    const byCategory = cats.map(c => ({ ...c, count: products.filter(p => p.category === c.id).length }));
    const maxCount = Math.max(1, ...byCategory.map(c => c.count));

    const bookings = DataStore.getBookings();
    const orders = DataStore.getOrders();
    const statusCounts = (list) => ["pending", "confirmed", "delivered", "cancelled"].reduce((acc, s) => {
      acc[s] = list.filter(x => x.status === s).length; return acc;
    }, {});
    const bStatus = statusCounts(bookings);
    const oStatus = statusCounts(orders);

    document.getElementById("view-statistics").innerHTML = `
      <div class="admin-panel">
        <div class="panel-head"><h2>Products by Category</h2></div>
        <div class="panel-body">
          ${byCategory.map(c => `
            <div style="margin-bottom:16px;">
              <div style="display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:6px;"><span>${c.name}</span><strong>${c.count}</strong></div>
              <div style="background:var(--paper-dim);border-radius:999px;height:10px;overflow:hidden;">
                <div style="width:${(c.count / maxCount) * 100}%;background:var(--indigo);height:100%;"></div>
              </div>
            </div>`).join("")}
        </div>
      </div>
      <div class="admin-panel">
        <div class="panel-head"><h2>Booking Status Breakdown</h2></div>
        <div class="panel-body kpi-grid" style="margin-bottom:0;">
          ${kpi("fa-regular fa-clock", bStatus.pending, "Pending")}
          ${kpi("fa-solid fa-check", bStatus.confirmed, "Confirmed")}
          ${kpi("fa-solid fa-xmark", bStatus.cancelled, "Cancelled")}
          ${kpi("fa-solid fa-list", bookings.length, "Total Bookings")}
        </div>
      </div>
      <div class="admin-panel">
        <div class="panel-head"><h2>Order Status Breakdown</h2></div>
        <div class="panel-body kpi-grid" style="margin-bottom:0;">
          ${kpi("fa-regular fa-clock", oStatus.pending, "Pending")}
          ${kpi("fa-solid fa-truck", oStatus.delivered, "Delivered")}
          ${kpi("fa-solid fa-xmark", oStatus.cancelled, "Cancelled")}
          ${kpi("fa-solid fa-sack-dollar", Utils.formatCurrency(orders.reduce((s, o) => s + o.total, 0)), "Total Order Value")}
        </div>
      </div>
    `;
  }

  function emptyRow(text) {
    return `<div class="empty-state"><i class="fa-regular fa-folder-open"></i><p>${text}</p></div>`;
  }

  // Mobile sidebar toggle
  document.getElementById("admin-mobile-toggle")?.addEventListener("click", () => {
    document.getElementById("admin-mobile-menu")?.classList.toggle("open");
  });

  showView("dashboard");
})();
