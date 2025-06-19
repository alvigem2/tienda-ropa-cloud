// script.js
import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Elementos del DOM
const contenedor = document.getElementById("productos");
const bienvenida = document.getElementById("bienvenida");
const acerca = document.getElementById("acerca");

// Muestra productos filtrados
async function cargarProductos(filtroCategoria = null) {
  contenedor.innerHTML = "";

  let productosRef = collection(db, "productos");
  let q = filtroCategoria
    ? query(productosRef, where("categoria", "==", filtroCategoria))
    : query(productosRef);

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    contenedor.innerHTML = "<p>No hay productos en esta categoría.</p>";
    return;
  }

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

// Filtro por categoría
document.querySelectorAll("[data-categoria]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const categoria = btn.dataset.categoria;
    bienvenida.style.display = "none";
    acerca.style.display = "none";
    cargarProductos(categoria);
  });
});

// Botón "Inicio"
document.getElementById("btnInicio").addEventListener("click", (e) => {
  e.preventDefault();
  bienvenida.style.display = "flex";
  acerca.style.display = "block";
  cargarProductos(); // Mostrar todos
});

// Inicial
cargarProductos();
