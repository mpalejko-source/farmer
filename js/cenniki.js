document.addEventListener("DOMContentLoaded", function () {
  const cenniki = window.ACE_CENNIKI || {};

  setText("cennikiDateTitle", cenniki.dateTitle || "Ceny: --");

  renderQuotes("cennikiPoland", cenniki.poland || []);
  renderQuotes("cennikiGlobal", cenniki.global || []);
  renderQuotes("cennikiFx", cenniki.fx || []);
});

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value || "";
  }
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
        <div class="quote-market">Uzupełnij plik data/cenniki.js</div>
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
