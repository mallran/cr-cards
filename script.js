const form = document.getElementById("cardForm");
const cardsContainer = document.getElementById("cards");
const addCardBtn = document.getElementById("addCardBtn");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const rarity = document.getElementById("rarity").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("image").value;
  const author = document.getElementById("author").value;

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${image}" alt="${name}" />
    <div class="info">
      <strong>${name}</strong>
      <span>${rarity}</span>
      <span>${price}</span>
      <span>👤 ${author}</span>
    </div>
  `;

  cardsContainer.prepend(card);
  form.reset();
  form.classList.remove("active");
});

addCardBtn.addEventListener("click", () => {
  form.classList.toggle("active");
});
