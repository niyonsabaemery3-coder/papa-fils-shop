/* Order page: review cart, edit quantities, submit the order (no payment) */

(function () {
  const cartList = document.getElementById("cart-list");
  const cartEmpty = document.getElementById("cart-empty");
  const cartTotalEl = document.getElementById("cart-total");
  const form = document.getElementById("order-form");
  const productSelect = document.getElementById("order-add-product");

  if (!cartList || !form) return;

  function lineTotal(cart) {
    return cart.reduce((sum, line) => {
      const p = DataStore.getProduct(line.productId);
      return sum + (p ? p.price * line.qty : 0);
    }, 0);
  }

  function renderCart() {
    const cart = DataStore.getCart();
    if (!cart.length) {
      cartList.innerHTML = "";
      cartEmpty.style.display = "block";
      form.querySelector('[type="submit"]').disabled = true;
    } else {
      cartEmpty.style.display = "none";
      form.querySelector('[type="submit"]').disabled = false;
      cartList.innerHTML = cart.map(line => {
        const p = DataStore.getProduct(line.productId);
        if (!p) return "";
        return `
          <div class="cart-line" data-id="${p.id}">
            <img src="${p.image}" alt="${Utils.escapeHtml(p.name)}">
            <div class="info">
              <h4>${Utils.escapeHtml(p.name)}</h4>
              <span class="price" style="font-size:14px;">${Utils.formatCurrency(p.price)}</span>
            </div>
            <div class="qty-ctrl">
              <button type="button" data-act="dec" aria-label="Decrease quantity">−</button>
              <span>${line.qty}</span>
              <button type="button" data-act="inc" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="icon-btn" data-act="remove" aria-label="Remove item"><i class="fa-solid fa-trash"></i></button>
          </div>`;
      }).join("");
    }
    cartTotalEl.textContent = Utils.formatCurrency(lineTotal(cart));
    const badge = document.getElementById("cart-count-badge");
    if (badge) badge.textContent = DataStore.cartCount();
  }

  cartList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const id = btn.closest(".cart-line").dataset.id;
    const cart = DataStore.getCart();
    const line = cart.find(c => c.productId === id);
    if (!line) return;
    if (btn.dataset.act === "inc") DataStore.updateCartQty(id, line.qty + 1);
    if (btn.dataset.act === "dec") DataStore.updateCartQty(id, line.qty - 1);
    if (btn.dataset.act === "remove") DataStore.removeFromCart(id);
    renderCart();
  });

  function populateProductSelect() {
    const products = DataStore.getProducts().filter(p => p.availability);
    productSelect.innerHTML = `<option value="">Add another product…</option>` +
      products.map(p => `<option value="${p.id}">${Utils.escapeHtml(p.name)} — ${Utils.formatCurrency(p.price)}</option>`).join("");
  }
  productSelect.addEventListener("change", () => {
    if (!productSelect.value) return;
    DataStore.addToCart(productSelect.value, 1);
    productSelect.value = "";
    renderCart();
    UI.toast("Product added to your order.", "success");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.customerName.value.trim();
    const phone = form.customerPhone.value.trim();
    const address = form.customerAddress.value.trim();
    const note = form.customerNote.value.trim();

    let valid = true;
    toggleFieldError(form.customerName, name.length < 2, "Please enter your full name.");
    toggleFieldError(form.customerPhone, !Utils.validatePhone(phone), "Enter a valid Rwandan phone number.");
    if (name.length < 2 || !Utils.validatePhone(phone)) valid = false;

    const cart = DataStore.getCart();
    if (!cart.length) { UI.toast("Your order is empty. Add a product first.", "error"); valid = false; }
    if (!valid) return;

    const items = cart.map(line => {
      const p = DataStore.getProduct(line.productId);
      return { productId: p.id, name: p.name, price: p.price, qty: line.qty };
    });
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);

    DataStore.addOrder({ customerName: name, customerPhone: phone, customerAddress: address, note, items, total });
    DataStore.clearCart();
    form.reset();
    renderCart();

    document.getElementById("order-success").style.display = "block";
    document.getElementById("order-form-card").style.display = "none";
    UI.toast("Order sent! We'll call you to confirm.", "success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function toggleFieldError(input, isInvalid, message) {
    const field = input.closest(".field");
    field.classList.toggle("invalid", isInvalid);
    const err = field.querySelector(".error");
    if (err && message) err.textContent = message;
  }

  populateProductSelect();
  renderCart();
})();
