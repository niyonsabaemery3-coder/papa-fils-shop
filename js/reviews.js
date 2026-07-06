/* Reviews page: add, edit, delete reviews. Editing is limited to reviews added
   from this browser (tracked via a private visitor token in localStorage) so
   customers can't tamper with each other's feedback. */

(function () {
  const list = document.getElementById("reviews-list");
  const form = document.getElementById("review-form");
  const starInput = document.getElementById("star-input");
  const avgEl = document.getElementById("avg-rating-display");
  const countEl = document.getElementById("review-count-display");

  if (!list) return;

  let currentRating = 0;
  let editingId = null;

  function renderStarsInput() {
    starInput.innerHTML = [1, 2, 3, 4, 5].map(i =>
      `<i class="fa-solid fa-star ${i <= currentRating ? "active" : ""}" data-star="${i}"></i>`
    ).join("");
  }
  starInput.addEventListener("click", (e) => {
    const star = e.target.closest("[data-star]");
    if (!star) return;
    currentRating = Number(star.dataset.star);
    renderStarsInput();
  });

  function renderSummary() {
    const reviews = DataStore.getReviews();
    countEl.textContent = `${reviews.length} review${reviews.length === 1 ? "" : "s"}`;
    const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;
    avgEl.textContent = reviews.length ? avg.toFixed(1) : "—";
  }

  function renderList() {
    const reviews = DataStore.getReviews();
    if (!reviews.length) {
      list.innerHTML = `<div class="empty-state"><i class="fa-regular fa-comment-dots"></i><p>No reviews yet. Be the first to share your experience.</p></div>`;
      return;
    }
    list.innerHTML = reviews.map(r => Render.reviewCard(r, DataStore.isMyReview(r))).join("");
    renderSummary();
  }

  list.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === "delete-review") {
      const ok = await UI.confirm("This will permanently remove your review.", { title: "Delete review?", confirmLabel: "Delete" });
      if (ok) { DataStore.deleteReview(id); renderList(); UI.toast("Review deleted.", "success"); }
    }
    if (btn.dataset.action === "edit-review") {
      const r = DataStore.getReviews().find(rev => rev.id === id);
      if (!r) return;
      editingId = id;
      form.reviewerName.value = r.name;
      form.reviewerComment.value = r.comment;
      currentRating = r.rating;
      renderStarsInput();
      form.querySelector('[type="submit"]').innerHTML = '<i class="fa-solid fa-check"></i> Update Review';
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.reviewerName.value.trim();
    const comment = form.reviewerComment.value.trim();

    const field = form.reviewerName.closest(".field");
    field.classList.toggle("invalid", name.length < 2);
    const commentField = form.reviewerComment.closest(".field");
    commentField.classList.toggle("invalid", comment.length < 5);

    if (name.length < 2 || comment.length < 5 || currentRating === 0) {
      if (currentRating === 0) UI.toast("Please select a star rating.", "error");
      return;
    }

    if (editingId) {
      DataStore.updateReview(editingId, { name, comment, rating: currentRating });
      UI.toast("Review updated.", "success");
      editingId = null;
      form.querySelector('[type="submit"]').innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Review';
    } else {
      DataStore.addReview({ name, comment, rating: currentRating });
      UI.toast("Thanks for your review!", "success");
    }
    form.reset();
    currentRating = 0;
    renderStarsInput();
    renderList();
  });

  renderStarsInput();
  renderList();
})();
