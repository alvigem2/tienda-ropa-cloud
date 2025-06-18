// script.js
import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const contenedor = document.getElementById("productos");

async function cargarProductos() {
  const productosRef = collection(db, "productos");
  const querySnapshot = await getDocs(productosRef);

  querySnapshot.forEach((doc) => {
    const p = doc.data();

    const card = document.createElement("div");
    card.className = "producto-card";

    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>${p.descripcion}</p>
      <p><strong>Bs ${p.precio}</strong></p>
      <button>Agregar al carrito</button>
    `;

    contenedor.appendChild(card);
  });
}

cargarProductos();
