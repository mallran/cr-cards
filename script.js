import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js"; // Добавил 'where' для будущих фильтров
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// 🔥 ЗАМЕНИТЕ ЭТИ ДАННЫЕ НА СВОИ РЕАЛЬНЫЕ ДАННЫЕ ИЗ КОНСОЛИ FIREBASE!
// Эти данные являются ПРИМЕРОМ и не будут работать с вашей базой данных без замены.
const firebaseConfig = {
  apiKey: "AIzaSyA2Jh3C0x1YktEndvk3OJ6nh3DAR6fRpIo", // <-- Замените на ваш apiKey
  authDomain: "cr-cards-2e11c.firebaseapp.com", // <-- Замените на ваш authDomain
  projectId: "cr-cards-2e11c", // <-- Замените на ваш projectId
  storageBucket: "cr-cards-2e11c.firebasestorage.app", // <-- Замените на ваш storageBucket
  messagingSenderId: "1065257153470", // <-- Замените на ваш messagingSenderId
  appId: "1:1065257153470:web:def77894e2e1f7b613bfef" // <-- Замените на ваш appId
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Функция для добавления новой карточки в базу данных
async function addCard(name, description, userName, price, file) {
  if (!file) {
    alert("Будь ласка, оберіть фото картки.");
    return;
  }

  // Загрузка фото в Firebase Storage
  const storageRef = ref(storage, 'cards/' + Date.now() + '_' + file.name);
  await uploadBytes(storageRef, file);
  const photoURL = await getDownloadURL(storageRef); // Получаем URL загруженного фото

  // Добавление данных карточки в Firestore
  await addDoc(collection(db, 'cards'), {
    name,
    description,
    userName,
    price,
    photoURL,
    createdAt: new Date() // Добавляем метку времени для сортировки
  });

  alert("Картка успішно додана!");
}

// Функция для отображения всех карточек из базы данных
// Теперь она может принимать параметры для сортировки/фильтрации
async function showCards(sortBy = 'createdAt_desc', cardType = 'all') { // Добавил параметры
  const container = document.getElementById('cardsContainer');
  container.innerHTML = "Завантаження карток..."; // Показываем индикатор загрузки

  const cardsCol = collection(db, 'cards');
  let q;

  // Базовый запрос с сортировкой
  if (sortBy === 'createdAt_asc') {
      q = query(cardsCol, orderBy('createdAt', 'asc'));
  } else { // createdAt_desc по умолчанию
      q = query(cardsCol, orderBy('createdAt', 'desc'));
  }

  // Здесь можно добавить логику фильтрации по cardType, если вы добавите соответствующее поле в данные карточки
  // Например:
  // if (cardType !== 'all') {
  //     q = query(q, where('type', '==', cardType));
  // }


  const querySnapshot = await getDocs(q); // Выполняем запрос

  container.innerHTML = ""; // Очищаем контейнер перед добавлением новых карточек

  // Если карточек нет, показываем соответствующее сообщение
  if (querySnapshot.empty) {
    container.innerHTML = "<p style='text-align: center; color: #ccc;'>Карток поки немає. Будьте першими!</p>";
    return;
  }

  // Проходим по каждой карточке и создаем HTML-элемент
  querySnapshot.forEach(doc => {
    const card = doc.data(); // Получаем данные карточки
    const cardEl = document.createElement('div');
    cardEl.classList.add('card'); // Добавляем класс 'card' для применения стилей

    cardEl.innerHTML = `
      <img src="${card.photoURL}" alt="Фото картки" />
      <div class="card-info">
        <h3>${card.name}</h3>
        <p><b>Опис:</b> ${card.description}</p>
        <p><b>Продавець:</b> <a href="https://t.me/${card.userName.replace('@', '')}" target="_blank" style="color: #a0f0ed; text-decoration: none;">${card.userName}</a></p>
        <p><b>Ціна:</b> ${card.price}</p>
      </div>
    `;
    container.appendChild(cardEl); // Добавляем карточку в контейнер
  });
}

// Обработчик события отправки формы
document.getElementById('addCardForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Предотвращаем стандартную отправку формы
  const form = e.target;
  // Получаем значения полей формы
  const name = form.name.value.trim();
  const description = form.description.value.trim();
  const userName = form.userName.value.trim();
  const price = form.price.value.trim();
  const photoFile = form.photo.files[0]; // Получаем выбранный файл

  try {
    await addCard(name, description, userName, price, photoFile); // Вызываем функцию добавления карточки
    form.reset(); // Очищаем форму после успешного добавления
    showCards(); // Обновляем список карточек на странице
  } catch (error) {
    alert("Помилка при додаванні картки: " + error.message);
    console.error("Error adding card: ", error); // Выводим ошибку в консоль для отладки
  }
});

// Обработчик для кнопки "Застосувати" фильтров
document.getElementById('applyFilters').addEventListener('click', () => {
    const sortBy = document.getElementById('sort-by').value;
    const cardType = document.getElementById('card-type').value;
    showCards(sortBy, cardType); // Вызываем showCards с выбранными параметрами
});


// Функция для плавной прокрутки к секциям
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) section.scrollIntoView({ behavior: "smooth", block: "start" }); // block: "start" для лучшего позиционирования
}

// Запускаем отображение карточек при загрузке страницы
showCards();
