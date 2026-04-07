document.addEventListener("DOMContentLoaded", function () {
  const charts = window.ACE_WYKRESY || [];
  const grid = document.getElementById("chartsGrid");

  if (grid) {
    grid.innerHTML = charts.map(function(item) {
      return `
        <div class="panel">
          <div class="panel-body">
            <div class="chart-card chart-card-large">
              <h3 class="chart-title">${escapeHtml(item.title)}</h3>
              <button type="button" class="chart-open" data-title="${escapeHtml(item.title)}" data-src="${escapeHtml(item.src)}">
                <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.title)}" class="chart-image">
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  initLightbox();
});

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxBackdrop = document.getElementById("lightboxBackdrop");
  const buttons = document.querySelectorAll(".chart-open");

  if (!lightbox || !lightboxImage || !lightboxTitle) return;

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const src = button.getAttribute("data-src");
      const title = button.getAttribute("data-title") || "Wykres";

      lightboxImage.src = src || "";
      lightboxTitle.textContent = title;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
