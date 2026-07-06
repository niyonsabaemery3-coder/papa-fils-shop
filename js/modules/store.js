/**
 * DataStore
 * ---------
 * Single source of truth for every piece of dynamic data on the site.
 * Nothing here talks to a server: everything is seeded from seed-data.js
 * on first load, then persisted to and read from localStorage.
 * Both the public site and the admin panel go through this same class,
 * so a change made in /admin appears instantly across the whole site.
 */

class DataStoreClass {
  constructor() {
    this._seedIfEmpty("products", SEED_PRODUCTS);
    this._seedIfEmpty("categories", SEED_CATEGORIES);
    this._seedIfEmpty("portfolio", SEED_PORTFOLIO);
    this._seedIfEmpty("reviews", SEED_REVIEWS);
    this._seedIfEmpty("business", SEED_BUSINESS);
    this._seedIfEmpty("settings", SEED_SETTINGS);
    this._seedIfEmpty("bookings", []);
    this._seedIfEmpty("orders", []);
    this._seedIfEmpty("messages", []);
    this._seedIfEmpty("cart", []);
  }

  _seedIfEmpty(key, seedValue) {
    if (!Storage.has(key)) Storage.set(key, seedValue);
  }

  /* ---------- Generic list helpers ---------- */
  _list(key) { return Storage.get(key, []); }
  _save(key, list) { Storage.set(key, list); }

  /* ================= CATEGORIES ================= */
  getCategories() { return this._list("categories"); }
  getCategory(id) { return this.getCategories().find(c => c.id === id); }

  /* ================= PRODUCTS ================= */
  getProducts() { return this._list("products"); }
  getProduct(id) { return this.getProducts().find(p => p.id === id); }
  getFeaturedProducts() { return this.getProducts().filter(p => p.featured); }

  addProduct(data) {
    const list = this.getProducts();
    const product = { id: Utils.genId("P"), availability: true, featured: false, ...data };
    list.unshift(product);
    this._save("products", list);
    return product;
  }
  updateProduct(id, data) {
    const list = this.getProducts();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data };
    this._save("products", list);
    return list[idx];
  }
  deleteProduct(id) {
    this._save("products", this.getProducts().filter(p => p.id !== id));
  }

  searchProducts({ query = "", category = "all", sort = "default", onlyAvailable = false } = {}) {
    let items = this.getProducts();
    if (category && category !== "all") items = items.filter(p => p.category === category);
    if (onlyAvailable) items = items.filter(p => p.availability);
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "price-asc": items = [...items].sort((a, b) => a.price - b.price); break;
      case "price-desc": items = [...items].sort((a, b) => b.price - a.price); break;
      case "name-asc": items = [...items].sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return items;
  }

  /* ================= PORTFOLIO ================= */
  getPortfolio() { return this._list("portfolio"); }
  addPortfolio(data) {
    const list = this.getPortfolio();
    const item = { id: Utils.genId("W"), ...data };
    list.unshift(item);
    this._save("portfolio", list);
    return item;
  }
  updatePortfolio(id, data) {
    const list = this.getPortfolio();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data };
    this._save("portfolio", list);
    return list[idx];
  }
  deletePortfolio(id) {
    this._save("portfolio", this.getPortfolio().filter(p => p.id !== id));
  }

  /* ================= REVIEWS ================= */
  getReviews() { return this._list("reviews").sort((a, b) => new Date(b.date) - new Date(a.date)); }
  addReview({ name, rating, comment }) {
    const list = this._list("reviews");
    const review = {
      id: Utils.genId("R"),
      name, rating: Number(rating), comment,
      date: new Date().toISOString().slice(0, 10),
      ownerToken: this._getOwnerToken()
    };
    list.unshift(review);
    this._save("reviews", list);
    return review;
  }
  updateReview(id, data) {
    const list = this._list("reviews");
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data };
    this._save("reviews", list);
    return list[idx];
  }
  deleteReview(id) {
    this._save("reviews", this._list("reviews").filter(r => r.id !== id));
  }
  _getOwnerToken() {
    let token = Storage.get("visitor_token");
    if (!token) { token = Utils.genId("VISITOR"); Storage.set("visitor_token", token); }
    return token;
  }
  isMyReview(review) { return review.ownerToken && review.ownerToken === this._getOwnerToken(); }

  /* ================= BOOKINGS ================= */
  getBookings() { return this._list("bookings").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); }
  addBooking(data) {
    const list = this._list("bookings");
    const booking = { id: Utils.genId("BK"), status: "pending", createdAt: new Date().toISOString(), ...data };
    list.unshift(booking);
    this._save("bookings", list);
    return booking;
  }
  updateBookingStatus(id, status) {
    const list = this._list("bookings");
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    this._save("bookings", list);
    return list[idx];
  }
  deleteBooking(id) {
    this._save("bookings", this._list("bookings").filter(b => b.id !== id));
  }

  /* ================= ORDERS ================= */
  getOrders() { return this._list("orders").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); }
  addOrder(data) {
    const list = this._list("orders");
    const order = { id: Utils.genId("OR"), status: "pending", createdAt: new Date().toISOString(), ...data };
    list.unshift(order);
    this._save("orders", list);
    return order;
  }
  updateOrderStatus(id, status) {
    const list = this._list("orders");
    const idx = list.findIndex(o => o.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    this._save("orders", list);
    return list[idx];
  }
  deleteOrder(id) {
    this._save("orders", this._list("orders").filter(o => o.id !== id));
  }

  /* ================= CART (for the order page) ================= */
  getCart() { return this._list("cart"); }
  addToCart(productId, qty = 1) {
    const cart = this.getCart();
    const line = cart.find(c => c.productId === productId);
    if (line) line.qty += qty; else cart.push({ productId, qty });
    this._save("cart", cart);
    return cart;
  }
  updateCartQty(productId, qty) {
    let cart = this.getCart();
    if (qty <= 0) { cart = cart.filter(c => c.productId !== productId); }
    else { const line = cart.find(c => c.productId === productId); if (line) line.qty = qty; }
    this._save("cart", cart);
    return cart;
  }
  removeFromCart(productId) {
    this._save("cart", this.getCart().filter(c => c.productId !== productId));
  }
  clearCart() { this._save("cart", []); }
  cartCount() { return this.getCart().reduce((sum, c) => sum + c.qty, 0); }

  /* ================= MESSAGES (contact form) ================= */
  getMessages() { return this._list("messages").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); }
  addMessage(data) {
    const list = this._list("messages");
    const msg = { id: Utils.genId("MSG"), read: false, createdAt: new Date().toISOString(), ...data };
    list.unshift(msg);
    this._save("messages", list);
    return msg;
  }
  markMessageRead(id) {
    const list = this._list("messages");
    const idx = list.findIndex(m => m.id === id);
    if (idx === -1) return;
    list[idx].read = true;
    this._save("messages", list);
  }
  deleteMessage(id) {
    this._save("messages", this._list("messages").filter(m => m.id !== id));
  }

  /* ================= BUSINESS INFO & SETTINGS ================= */
  getBusiness() { return Storage.get("business", SEED_BUSINESS); }
  updateBusiness(data) {
    const merged = { ...this.getBusiness(), ...data };
    Storage.set("business", merged);
    return merged;
  }

  getSettings() { return Storage.get("settings", SEED_SETTINGS); }
  updateSettings(data) {
    const merged = { ...this.getSettings(), ...data };
    Storage.set("settings", merged);
    return merged;
  }

  /* ================= STATS (for home + admin dashboard) ================= */
  getDashboardStats() {
    return {
      products: this.getProducts().length,
      bookings: this.getBookings().length,
      pendingBookings: this.getBookings().filter(b => b.status === "pending").length,
      orders: this.getOrders().length,
      pendingOrders: this.getOrders().filter(o => o.status === "pending").length,
      reviews: this.getReviews().length,
      avgRating: (() => {
        const r = this.getReviews();
        return r.length ? (r.reduce((s, x) => s + x.rating, 0) / r.length).toFixed(1) : "—";
      })(),
      messages: this.getMessages().length,
      unreadMessages: this.getMessages().filter(m => !m.read).length,
      portfolio: this.getPortfolio().length
    };
  }

  /* ================= RESET (dev helper, exposed in admin settings) ================= */
  resetAll() {
    ["products", "categories", "portfolio", "reviews", "business", "settings", "bookings", "orders", "messages", "cart"]
      .forEach(k => Storage.remove(k));
    location.reload();
  }
}

const DataStore = new DataStoreClass();
