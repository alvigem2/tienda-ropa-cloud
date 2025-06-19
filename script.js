import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Elementos del DOM
const contenedor     = document.getElementById("productos");
const bienvenida     = document.getElementById("bienvenida");
const acerca         = document.getElementById("acerca");
const btnInicio      = document.getElementById("btnInicio");
const btnHamburguesa = document.getElementById("btnHamburguesa");
const menu           = document.querySelector(".menu");
const carritoIcono   = document.getElementById("carritoIcono");
const carritoPanel   = document.getElementById("carritoPanel");
const listaCarrito   = document.getElementById("listaCarrito");
const btnWhatsapp    = document.getElementById("btnConfirmarWhatsapp");
const cerrarCarrito  = document.getElementById("cerrarCarrito");
const buscador       = document.getElementById("buscador");
const btnModoOscuro  = document.getElementById("btnModoOscuro");
const loader         = document.getElementById("loader");

let carrito = [];

// Función para cargar productos (con loader)
async function cargarProductos(filtroCategoria = null) {
  contenedor.innerHTML = "";
  loader.classList.remove("oculto"); // mostrar animación

  const productosRef = collection(db, "productos");
  const q = filtroCategoria
    ? query(productosRef, where("categoria", "==", filtroCategoria))
    : query(productosRef);

  const querySnapshot = await getDocs(q);
  loader.classList.add("oculto"); // ocultar cuando termina

  if (querySnapshot.empty) {
    contenedor.innerHTML = "<p>No hay productos en esta categoría.</p>";
    return;
  }

  querySnapshot.forEach(doc => {
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

  // Botones "Agregar al carrito"
  document.querySelectorAll(".producto-card button").forEach(btn => {
    btn.addEventListener("click", () => {
      const nombre = btn.dataset.nombre;
      const precio = parseFloat(btn.dataset.precio);
      const existe = carrito.find(item => item.nombre === nombre);
      if (existe) {
        existe.cantidad++;
      } else {
        carrito.push({ nombre, precio, cantidad: 1 });
      }
      actualizarCarrito();
      // Mensaje flotante
      const msg = document.getElementById("mensajeAgregado");
      msg.classList.add("mostrar");
      msg.classList.remove("oculto");
      setTimeout(() => {
        msg.classList.remove("mostrar");
        msg.classList.add("oculto");
      }, 1500);
    });
  });
}

// Función para actualizar carrito
function actualizarCarrito() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<li>El carrito está vacío.</li>";
    btnWhatsapp.classList.add("oculto");
    document.getElementById("totalCarrito").textContent = "Total: 0 Bs";
    document.getElementById("contadorCarrito").textContent = "0";
    return;
  }

  carrito.forEach((item, i) => {
    const subtotal = item.precio * item.cantidad;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} x${item.cantidad} - Bs ${subtotal}
      <button class="btnQuitar" data-index="${i}">➖</button>
    `;
    listaCarrito.appendChild(li);
  });

  // Quitar unidad o producto
  listaCarrito.querySelectorAll(".btnQuitar").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.index;
      if (carrito[idx].cantidad > 1) {
        carrito[idx].cantidad--;
      } else {
        carrito.splice(idx, 1);
      }
      actualizarCarrito();
    });
  });

  const total = carrito.reduce((s, it) => s + it.precio * it.cantidad, 0);
  document.getElementById("totalCarrito").textContent = `Total: ${total} Bs`;
  document.getElementById("contadorCarrito").textContent = carrito.length;

  const msg = encodeURIComponent(
    `Hola, quiero comprar:\n\n` +
    carrito.map(i => `- ${i.nombre} x${i.cantidad} (Bs ${i.precio})`).join("\n") +
    `\n\nTotal: ${total} Bs`
  );
  btnWhatsapp.href = `https://wa.me/59172553154?text=${msg}`;
  btnWhatsapp.classList.remove("oculto");
}

// ----------------------------------
// Eventos globales

// Menú hamburguesa
btnHamburguesa.addEventListener("click", () => {
  menu.classList.toggle("mostrar");
});

// Filtro por categoría
document.querySelectorAll("[data-categoria]").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    bienvenida.style.display = "none";
    acerca.style.display = "none";
    menu.classList.remove("mostrar");
    cargarProductos(btn.dataset.categoria);
  });
});

// Inicio
btnInicio.addEventListener("click", e => {
  e.preventDefault();
  bienvenida.style.display = "flex";
  acerca.style.display   = "block";
  menu.classList.remove("mostrar");
  cargarProductos();
});

// Abrir/cerrar carrito
carritoIcono.addEventListener("click", () => {
  carritoPanel.classList.toggle("mostrar");
});
cerrarCarrito.addEventListener("click", () => {
  carritoPanel.classList.remove("mostrar");
});

// Buscador
buscador.addEventListener("input", () => {
  const t = buscador.value.toLowerCase();
  bienvenida.style.display = "none";
  acerca.style.display     = "none";
  document.querySelectorAll(".producto-card").forEach(card => {
    const nm = card.querySelector("h3").textContent.toLowerCase();
    const dc = card.querySelector("p").textContent.toLowerCase();
    card.style.display = nm.includes(t) || dc.includes(t) ? "block" : "none";
  });
});

// Modo oscuro
btnModoOscuro.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  btnModoOscuro.textContent = document.body.classList.contains("dark-mode")
    ? "☀️" : "🌙";
});

// Inicial
cargarProductos();
