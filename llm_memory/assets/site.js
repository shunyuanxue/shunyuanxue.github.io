const input = document.getElementById("page-search");
if (input) {
  const targets = [...document.querySelectorAll("[data-search]")];
  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    for (const target of targets) {
      target.classList.toggle("is-hidden", Boolean(query) && !target.dataset.search.includes(query));
    }
  });
}
