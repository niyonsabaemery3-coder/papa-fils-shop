/* Booking page: reserve a specific product without payment */

(function () {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const productSelect = form.bookingProduct;
  const params = new URLSearchParams(location.search);
  const preselect = params.get("product");

  function populateProducts() {
    const products = DataStore.getProducts().filter(p => p.availability);
    productSelect.innerHTML = `<option value="" disabled ${!preselect ? "selected" : ""}>Choose a product…</option>` +
      products.map(p => `<option value="${p.id}" ${p.id === preselect ? "selected" : ""}>${Utils.escapeHtml(p.name)} — ${Utils.formatCurrency(p.price)}</option>`).join("");
  }

  function toggleFieldError(input, isInvalid, message) {
    const field = input.closest(".field");
    field.classList.toggle("invalid", isInvalid);
    const err = field.querySelector(".error");
    if (err && message) err.textContent = message;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const productId = form.bookingProduct.value;
    const name = form.bookingName.value.trim();
    const phone = form.bookingPhone.value.trim();
    const qty = Number(form.bookingQty.value) || 1;
    const note = form.bookingNote.value.trim();

    let valid = true;
    toggleFieldError(form.bookingProduct, !productId, "Please choose a product.");
    toggleFieldError(form.bookingName, name.length < 2, "Please enter your full name.");
    toggleFieldError(form.bookingPhone, !Utils.validatePhone(phone), "Enter a valid Rwandan phone number.");
    if (!productId || name.length < 2 || !Utils.validatePhone(phone)) valid = false;
    if (!valid) return;

    const product = DataStore.getProduct(productId);
    DataStore.addBooking({
      productId, productName: product.name, productPrice: product.price,
      customerName: name, customerPhone: phone, quantity: qty, note
    });

    form.reset();
    document.getElementById("booking-success").style.display = "block";
    document.getElementById("booking-form-card").style.display = "none";
    UI.toast("Booking received! We'll call you to confirm.", "success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  populateProducts();
})();
