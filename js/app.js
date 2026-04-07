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
  const parsed = parseChange(value);
  const safeFullValue = escapeHtml(value || "-");

  return `
    <span class="delta-badge ${parsed.cls}" title="${safeFullValue}">
      <span class="delta-arrow">${parsed.arrow}</span>
      <span class="delta-label">${label}</span>
      <span class="delta-value">${escapeHtml(parsed.display)}</span>
    </span>
  `;
}

function parseChange(value) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return {
      cls: "flat",
      arrow: "→",
      display: "-"
    };
  }

  const text = String(value).trim();

  if (text.startsWith("+")) {
    return {
      cls: "up",
      arrow: "▲",
      display: text
    };
  }

  if (text.startsWith("-")) {
    return {
      cls: "down",
      arrow: "▼",
      display: text
    };
  }

  if (text === "0" || text === "0,0" || text === "0.0" || text.toLowerCase() === "flat") {
    return {
      cls: "flat",
      arrow: "→",
      display: text === "flat" ? "0" : text
    };
  }

  return {
    cls: "flat",
    arrow: "→",
    display: text
  };
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
