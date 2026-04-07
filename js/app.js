document.addEventListener("DOMContentLoaded", function () {
  const komentarz = window.ACE_KOMENTARZ || {};
  const ceny = window.ACE_CENY || {};

  setText("heroTitle", komentarz.heroTitle);
  setText("heroLead", komentarz.heroLead);
  setText("metaDate", "Aktualizacja: " + (komentarz.aktualizacja || "--"));
  setText("introTitle", komentarz.introTitle);
  setText("introText", komentarz.introText);
  setText("farmerConclusion", komentarz.farmerConclusion);
  setText("pricesDateTitle", ceny.dateTitle || "Ceny: --");

  renderComment("mainComment", komentarz.paragraphs || []);
  renderQuotes("polandList", ceny.poland || []);
  renderQuotes("globalList", ceny.global || []);
  renderQuotes("fxList", ceny.fx || []);

  initLightbox();
});

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value || "";
  }
}

function renderComment(targetId, paragraphs) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.innerHTML = "";

  if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
    const p = document.createElement("p");
    p.textContent = "Brak komentarza na dziś.";
    target.appendChild(p);
    return;
  }

  paragraphs.forEach(function (text) {
    const p = document.createElement("p");
    p.textContent = text;
    target.appendChild(p);
  });
}

function renderQuotes(targetId, items) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
    const row = document.createElement("div");
    row.className = "quote-row";
    row.innerHTML = `
      <div class="quote-left">
        <div class="quote-name">Brak danych</div>
        <div class="quote-market">Uzupełnij plik data/ceny.js</div>
      </div>
    `;
    target.appendChild(row);
    return;
  }

  items.forEach(function (item) {
    const row = document.createElement("div");
    row.className = "quote-row";

    row.innerHTML = `
      <div class="quote-left">
        <div class="quote-name">${escapeHtml(item.name || "")}</div>
        <div class="quote-market">${escapeHtml(item.market || "")}</div>
      </div>
      <div class="quote-right">
        <div class="quote-value">${escapeHtml(item.value || "")}</div>
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
  const safeValue = escapeHtml(value || "-");

  return `
    <span class="delta-badge ${cls}" title="${safeValue}">
      <span class="delta-arrow">${arrow}</span>
      <span class="delta-label">${label}</span>
    </span>
  `;
}

function getChangeClass(value) {
  if (!value) return "flat";

  const text = String(value).trim();

  if (text.startsWith("+")) return "up";
  if (text.startsWith("-")) return "down";

  return "flat";
}

function getArrow(value) {
  if (!value) return "→";

  const text = String(value).trim();

  if (text.startsWith("+")) return "▲";
  if (text.startsWith("-")) return "▼";

  return "→";
}

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
