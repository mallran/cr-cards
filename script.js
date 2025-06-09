import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// 🔥 Замінити на свої реальні дані з Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA2Jh3C0x1YktEndvk3OJ6nh3DAR6fRpIo",
  authDomain: "cr-cards-2e11c.firebaseapp.com",
  projectId: "cr-cards-2e11c",
  storageBucket: "cr-cards-2e11c.firebasestorage.app",
  messagingSenderId: "1065257153470",
  appId: "1:1065257153470:web:def77894e2e1f7b613bfef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

async function addCard(name, description, userName, price, file) {
  if (!file) {
    alert("Виберіть фото картки");
    return;
  }

  const storageRef = ref(storage, 'cards/' + Date.now() + '_' + file.name);
  await uploadBytes(storageRef, file);
  const photoURL = await getDownloadURL(storageRef);

  await addDoc(collection(db, 'cards'), {
    name,
    description,
    userName,
    price,
    photoURL,
    createdAt: new Date()
  });

  alert("Картка додана!");
}

async function showCards() {
  const container = document.getElementById('cardsContainer');
  container.innerHTML = "Завантаження карток...";

  const cardsCol = collection(db, 'cards');
  const q = query(cardsCol, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  container.innerHTML = "";

  querySnapshot.forEach(doc => {
    const card = doc.data();
    const cardEl = document.createElement('div');
    cardEl.innerHTML = `
      <img src="${card.photoURL}" alt="Фото картки" />
      <h3>${card.name}</h3>
      <p><b>Опис:</b> ${card.description}</p>
      <p><b>Продавець:</b> ${card.userName}</p>
      <p><b>Ціна:</b> ${card.price}</p>
    `;
    container.appendChild(cardEl);
  });

  if (container.innerHTML === "") {
    container.innerHTML = "<p>Карток поки немає.</p>";
  }
}

document.getElementById('addCardForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const description = form.description.value.trim();
  const userName = form.userName.value.trim();
  const price = form.price.value.trim();
  const photoFile = form.photo.files[0];

  try {
    await addCard(name, description, userName, price, photoFile);
    form.reset();
    showCards();
  } catch (error) {
    alert("Помилка при додаванні картки: " + error.message);
  }
});

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) section.scrollIntoView({ behavior: "smooth" });
}

showCards();
