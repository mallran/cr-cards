document.getElementById('cardForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const date = new Date().toLocaleDateString();

  const cardEl = document.createElement('div');
  cardEl.className = 'card';
  cardEl.innerHTML = `
    <div class="card-title">${title}</div>
    <div class="card-date">Дата: ${date}</div>
    <div class="card-price">Ціна: ${price}</div>
  `;

  document.getElementById('cardList').prepend(cardEl);

  this.reset();
});
