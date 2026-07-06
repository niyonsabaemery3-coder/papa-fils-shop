/* Contact page: validate and store the message form via DataStore */

(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  function toggleFieldError(input, isInvalid, message) {
    const field = input.closest(".field");
    field.classList.toggle("invalid", isInvalid);
    const err = field.querySelector(".error");
    if (err && message) err.textContent = message;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.contactName.value.trim();
    const email = form.contactEmail.value.trim();
    const phone = form.contactPhone.value.trim();
    const subject = form.contactSubject.value.trim();
    const message = form.contactMessage.value.trim();

    let valid = true;
    toggleFieldError(form.contactName, name.length < 2, "Please enter your name.");
    toggleFieldError(form.contactEmail, email && !Utils.validateEmail(email), "Enter a valid email or leave this blank.");
    toggleFieldError(form.contactPhone, !Utils.validatePhone(phone), "Enter a valid Rwandan phone number.");
    toggleFieldError(form.contactMessage, message.length < 10, "Message should be at least 10 characters.");

    if (name.length < 2 || (email && !Utils.validateEmail(email)) || !Utils.validatePhone(phone) || message.length < 10) valid = false;
    if (!valid) return;

    DataStore.addMessage({ name, email, phone, subject, message });
    form.reset();
    document.getElementById("contact-success").style.display = "block";
    document.getElementById("contact-form-card").style.display = "none";
    UI.toast("Message sent! We'll get back to you soon.", "success");
  });
})();
