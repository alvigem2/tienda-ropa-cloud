import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const contenedor = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalElemento = document.getElementById("total");
const btnFinalizar = document.getElementById("btnFinalizar");
const carritoDiv = document.getElementById("carrito");

let carrito = [];
let total = 0;

async function cargarProductos() {
  const productosRef = collection(db, "productos");
  const querySnapshot = await getDocs(productosRef);

  querySnapshot.forEach((doc) => {
    const p = doc.data();

    const card = document.createElement("div");
    card.className = "producto-card";

    const btnAgregar = document.createElement("button");
    btnAgregar.textContent = "Agregar al carrito";
    btnAgregar.onclick = () => agregarAlCarrito(p);

    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>${p.descripcion}</p>
      <p><strong>Bs ${p.precio}</strong></p>
    `;
    card.appendChild(btnAgregar);
    contenedor.appendChild(card);
  });
}

function agregarAlCarrito(producto) {
  carrito.push(producto);
  total += producto.precio;

  // Mostrar carrito
  carritoDiv.classList.remove("carrito-hidden");

  // Mostrar productos
  const item = document.createElement("li");
  item.textContent = `${producto.nombre} - Bs ${producto.precio}`;
  listaCarrito.appendChild(item);

  // Actualizar total
  totalElemento.textContent = total;

  // Actualizar link de WhatsApp
  const mensaje = carrito.map(p => `${p.nombre} - Bs ${p.precio}`).join('\n') + `\nTotal: Bs ${total}`;
  const mensajeEncoded = encodeURIComponent(mensaje);
  btnFinalizar.href = `https://wa.me/59172553154?text=${mensajeEncoded}`;
}

cargarProductos();
