const searchbar = document.querySelector("input")
const div = document.querySelector("body > div") as HTMLDivElement

searchbar?.addEventListener("input", e => {
  div.querySelectorAll("h1").forEach(h1 => {
    const matches = h1.textContent.toUpperCase().includes(searchbar.value.toUpperCase())
    h1.style.display = matches ? "block" : "none";
    (<HTMLTableElement>h1.nextElementSibling).style.display = matches ? "table" : "none"
  })
})