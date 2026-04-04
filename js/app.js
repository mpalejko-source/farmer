document.addEventListener("DOMContentLoaded", function () {
  const komentarz = window.ACE_KOMENTARZ || {};
  const ceny = window.ACE_CENY || {};

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "";
  }

  setText("heroTitle", komentarz.heroTitle);
  setText("heroLead", komentarz.heroLead);
  setText("metaDate", "Aktualizacja: " + (komentarz.aktualizacja || "--"));
  setText("introTitle", komentarz.introTitle);
  setText("introText", komentarz.introText);
  setText("farmerConclusion", komentarz.farmerConclusion);
  setText("pricesDateTitle", ceny.dateTitle || "Ceny: --");

  const mainComment = document.getElementById("mainComment");
  if (mainComment && Array.isArray(komentarz.paragraphs)) {
    mainComment.innerHTML = "";
    komentarz.paragraphs.forEach(function (txt) {
      const p = document.createElement("p");
      p.textContent = txt;
      mainComment.appendChild(p);
    });
  }

  renderQuotes("polandList", ceny.poland || []);
  renderQuotes("globalList", ceny.global || []);
  renderQuotes("fxList", ceny.fx || []);

  initLightbox();
});

function renderQuotes(targetId, items) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.innerHTML = "";

  items.forEach(function (item) {
    const row = document.createElement("div");
    row.className = "quote-row";

    row.innerHTML = `
      <div class="quote-left">
        <div class="quote-name">${item.name || ""}</div>
        <div class="quote-market">${item.market || ""}</div>
      </div>
      <div class="quote-right">
        <div class="quote-value">${item.value || ""}</div>
        <div class="quote-changes badges-two-line">
          ${renderBadge("T", item.week)}
          ${renderBadge("M", item.month)}
        </div>
      </div>
    `;

    target.appendChild(row);
  });
}

function renderBadge(label, value) {
  const cls = getChangeClass(value);
  const arrow = getArrow(value);
  return `<span class="delta-badge ${cls}" title="${value || "-"}">
    <span class="delta-arrow">${arrow}</span>
    <span class="delta-label">${label}</span>
  </span>`;
}

function getChangeClass(value) {
  if (!value) return "flat";
  const t = String(value).trim();
  if (t.startsWith("+")) return "up";
  if (t.startsWith("-")) return "down";
  return "flat";
}

function getArrow(value) {
  if (!value) return "→";
  const t = String(value).trim();
  if (t.startsWith("+")) return "▲";
  if (t.startsWith("-")) return "▼";
  return "→";
}

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
