(function () {
  const k = window.ACE_KOMENTARZ || {};
  const c = window.ACE_CENY || {};

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && value !== undefined) el.textContent = value;
  };

  setText("heroTitle", k.heroTitle);
  setText("heroLead", k.heroLead);
  setText("metaDate", "Aktualizacja: " + (k.aktualizacja || "--"));
  setText("introTitle", k.introTitle);
  setText("introText", k.introText);
  setText("farmerConclusion", k.farmerConclusion);
  setText("pricesDateTitle", c.dateTitle || "Ceny: --");

  const mainComment = document.getElementById("mainComment");
  if (mainComment && Array.isArray(k.paragraphs)) {
    mainComment.innerHTML = k.paragraphs.map(p => `<p>${p}</p>`).join("");
  }

  renderQuotes("polandList", c.poland || []);
  renderQuotes("globalList", c.global || []);

  function renderQuotes(targetId, items) {
    const target = document.getElementById(targetId);
    if (!target) return;

    target.innerHTML = items.map(item => `
      <div class="quote-row">
        <div class="quote-left">
          <div class="quote-name">${item.name}</div>
          <div class="quote-market">${item.market}</div>
        </div>
        <div class="quote-right">
          <div class="quote-value">${item.value}</div>
          <div class="quote-changes">
            <span class="chg ${getChangeClass(item.week)}">Tydz: ${item.week}</span>
            <span class="chg ${getChangeClass(item.month)}">Mies: ${item.month}</span>
          </div>
        </div>
      </div>
    `).join("");
  }

  function getChangeClass(value) {
    if (!value) return "flat";
    const trimmed = String(value).trim();
    if (trimmed.startsWith("+")) return "up";
    if (trimmed.startsWith("-")) return "down";
    return "flat";
  }

  // Lightbox wykresów
  const lightbox = document.getElementById("lightbox");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxBackdrop = document.getElementById("lightboxBackdrop");
  const chartButtons = document.querySelectorAll(".chart-open");

  chartButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-src");
      const title = btn.getAttribute("data-title") || "Wykres";
      openLightbox(src, title);
    });
  });

  function openLightbox(src, title) {
    if (!lightbox || !lightboxImage || !lightboxTitle) return;
    lightboxImage.src = src;
    lightboxTitle.textContent = title;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
})();
