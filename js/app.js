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

  const mainComment = document.getElementById("mainComment");
  if (mainComment && Array.isArray(k.paragraphs)) {
    mainComment.innerHTML = k.paragraphs.map(p => `<p>${p}</p>`).join("");
  }

  setText("pricesTitle", c.title);
  setText("pricesDate", c.dateLabel);

  const priceList = document.getElementById("priceList");
  if (priceList && Array.isArray(c.items)) {
    priceList.innerHTML = c.items.map(item => `
      <div class="price-item">
        <div class="price-top">
          <div>
            <div class="price-name">${item.name}</div>
            <div class="price-market">${item.market}</div>
          </div>
        </div>
        <div class="price-bottom">
          <div class="price-value">${item.value}</div>
          <div class="price-changes">
            <div class="chg ${getChangeClass(item.week)}">Tydz: ${item.week}</div>
            <div class="chg ${getChangeClass(item.month)}">Mies: ${item.month}</div>
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
})();
