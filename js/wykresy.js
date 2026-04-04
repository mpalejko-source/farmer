document.addEventListener("DOMContentLoaded", function () {
  const charts = window.ACE_WYKRESY || [];
  const grid = document.getElementById("chartsGrid");

  if (grid) {
    grid.innerHTML = charts.map(item => `
      <div class="panel">
        <div class="panel-body">
          <div class="chart-card chart-card-large">
            <h3 class="chart-title">${item.title}</h3>
            <button type="button" class="chart-open" data-title="${item.title}" data-src="${item.src}">
              <img src="${item.src}" alt="${item.title}" class="chart-image">
            </button>
          </div>
        </div>
      </div>
    `).join("");
  }

  initLightbox();
});

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxBackdrop = document.getElementById("lightboxBackdrop");
  const chartButtons = document.querySelectorAll(".chart-open");

  function openLightbox(src, title) {
    if (!lightbox) return;
    lightboxImage.src = src;
    lightboxTitle.textContent = title || "Wykres";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  }

  chartButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      openLightbox(btn.getAttribute("data-src"), btn.getAttribute("data-title"));
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}
