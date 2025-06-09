// Прокрутка до секцій
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// Вибираємо форму та контейнер для карток
const form = document.getElementById("addCardForm");
const cardsContainer = document.getElementById("cardsContainer");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const author = formData.get("userName");
  const imageFile = formData.get("photo");

  const reader = new FileReader();
  reader.onload = function () {
    const imageSrc = reader.result;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${imageSrc}" alt="${name}" />
      <div class="card-info">
        <h3>${name}</h3>
        <p>${description}</p>
        <p><b>Ціна:</b> ${price}</p>
        <p><b>👤 ${author}</b></p>
      </div>
    `;

    cardsContainer.prepend(card);
    form.reset();
  };

  if (imageFile) {
    reader.readAsDataURL(imageFile);
  }
});
