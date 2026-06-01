const input = document.getElementById("page-search");
if (input) {
  const targets = [...document.querySelectorAll("[data-search]")];
  const results = document.getElementById("search-results");
  const scriptUrl = document.currentScript ? document.currentScript.src : new URL("assets/site.js", location.href).href;
  const siteRoot = new URL("../", scriptUrl);
  let indexPromise = null;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
  const loadIndex = () => {
    if (!indexPromise) {
      indexPromise = fetch(new URL("search-index.json", scriptUrl))
        .then((response) => response.ok ? response.json() : { entries: [] })
        .catch(() => ({ entries: [] }));
    }
    return indexPromise;
  };
  const renderResults = async (query) => {
    if (!results) return;
    if (!query || query.length < 2) {
      results.hidden = true;
      results.innerHTML = "";
      return;
    }
    const index = await loadIndex();
    const matches = (index.entries || [])
      .filter((entry) => entry.text.includes(query))
      .slice(0, 24);
    results.hidden = false;
    const body = matches.length
      ? matches.map((entry) => {
          const href = new URL(entry.href, siteRoot).href;
          return '<a class="search-result" href="' + href + '"><strong>' + escapeHtml(entry.title) + '</strong><span>' + escapeHtml(entry.category + " · " + (entry.updated || "未标注日期")) + '</span><span>' + escapeHtml(entry.summary || "") + '</span></a>';
        }).join("")
      : '<p class="muted">没有匹配结果。</p>';
    results.innerHTML = '<h2>搜索结果</h2><div class="search-results-list">' + body + '</div>';
  };
  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    for (const target of targets) {
      target.classList.toggle("is-hidden", Boolean(query) && !target.dataset.search.includes(query));
    }
    renderResults(query);
  });
}
