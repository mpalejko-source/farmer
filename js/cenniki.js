document.addEventListener("DOMContentLoaded", function () {
  const ceny = window.ACE_CENY || {};
  const title = document.getElementById("cennikiDateTitle");
  if (title) title.textContent = ceny.dateTitle || "Ceny: --";

  renderQuotes("cennikiPoland", ceny.poland || []);
  renderQuotes("cennikiGlobal", ceny.global || []);
  renderQuotes("cennikiFx", ceny.fx || []);
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
