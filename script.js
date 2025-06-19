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
const btnInicio = document.getElementById("btnInicio");
const btnHamburguesa = document.getElementById("btnHamburguesa");
const menu = document.querySelector(".menu");
const carritoIcono = document.getElementById("carritoIcono");
const carritoPanel = document.getElementById("carritoPanel");
const listaCarrito = document.getElementById("listaCarrito");
const btnWhatsapp = document.getElementById("btnConfirmarWhatsapp");

// Carrito simulado
let carrito = [];

// Mostrar productos filtrados
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
      <button data-nombre="${p.nombre}" data-precio="${p.precio}">Agregar al carrito</button>
    `;

    contenedor.appendChild(card);
  });

  // Escuchar botones de "Agregar al carrito"
  document.querySelectorAll(".producto-card button").forEach(btn => {
    btn.addEventListener("click", () => {
      const nombre = btn.dataset.nombre;
      const precio = parseFloat(btn.dataset.precio);

      carrito.push({ nombre, precio });
      actualizarCarrito();
    });
  });
}

// Mostrar carrito
function actualizarCarrito() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<li>El carrito está vacío.</li>";
    btnWhatsapp.classList.add("oculto");
    return;
  }

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - Bs ${item.precio}`;
    listaCarrito.appendChild(li);
  });

  const total = carrito.reduce((sum, item) => sum + item.precio, 0);
  const mensaje = encodeURIComponent(
    `Hola, quiero comprar lo siguiente:\n\n${carrito.map(i => `- ${i.nombre} (${i.precio} Bs)`).join("\n")}\n\nTotal: ${total} Bs`
  );

  btnWhatsapp.href = `https://wa.me/59172553154?text=${mensaje}`;
  btnWhatsapp.classList.remove("oculto");
}

// Menú hamburguesa
btnHamburguesa.addEventListener("click", () => {
  menu.classList.toggle("mostrar");
});

// Filtro por categoría
document.querySelectorAll("[data-categoria]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const categoria = btn.dataset.categoria;
    bienvenida.style.display = "none";
    acerca.style.display = "none";
    menu.classList.remove("mostrar");
    cargarProductos(categoria);
  });
});

// Botón "Inicio"
btnInicio.addEventListener("click", (e) => {
  e.preventDefault();
  bienvenida.style.display = "flex";
  acerca.style.display = "block";
  menu.classList.remove("mostrar");
  cargarProductos(); // Mostrar todos
});

// Icono del carrito
carritoIcono.addEventListener("click", () => {
  carritoPanel.classList.toggle("mostrar");
});

// Inicial
cargarProductos();
