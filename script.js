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
const cerrarCarrito = document.getElementById("cerrarCarrito");

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

      // Ver si ya está en el carrito
      const productoExistente = carrito.find(item => item.nombre === nombre);
      if (productoExistente) {
        productoExistente.cantidad++;
      } else {
        carrito.push({ nombre, precio, cantidad: 1 });
      }
      actualizarCarrito();

      const mensaje = document.getElementById("mensajeAgregado");
      mensaje.classList.add("mostrar");
      mensaje.classList.remove("oculto");

      setTimeout(() => {
        mensaje.classList.remove("mostrar");
        mensaje.classList.add("oculto");
      }, 1500);
    });
  });
}

// Mostrar carrito
function actualizarCarrito() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<li>El carrito está vacío.</li>";
    btnWhatsapp.classList.add("oculto");
    document.getElementById("totalCarrito").textContent = "Total: 0 Bs";
    return;
  }

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    const subtotal = item.precio * item.cantidad;
    li.innerHTML = `
      ${item.nombre} x${item.cantidad} - Bs ${subtotal}
      <button class="btnQuitar" data-index="${index}">➖</button>
    `;
    listaCarrito.appendChild(li);
  });


  // Escuchar botones de eliminar
  listaCarrito.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      carrito.splice(index, 1);
      actualizarCarrito();
    });
  });

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  document.getElementById("totalCarrito").textContent = `Total: ${total} Bs`;

  const mensaje = encodeURIComponent(
    `Hola, quiero comprar lo siguiente:\n\n` +
    carrito.map(i => `- ${i.nombre} x${i.cantidad} (${i.precio} Bs c/u)`).join("\n") +
    `\n\nTotal: ${total} Bs`
  );

  btnWhatsapp.href = `https://wa.me/59172553154?text=${mensaje}`;
  btnWhatsapp.classList.remove("oculto");

  document.getElementById("contadorCarrito").textContent = carrito.length;

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

// Botón cerrar carrito
cerrarCarrito.addEventListener("click", () => {
  carritoPanel.classList.remove("mostrar");
});

// Búsqueda por texto
const buscador = document.getElementById("buscador");
buscador.addEventListener("input", () => {
  const texto = buscador.value.toLowerCase();

  // Ocultar bienvenida y acerca
  bienvenida.style.display = "none";
  acerca.style.display = "none";

  // Filtrar el DOM directamente
  document.querySelectorAll(".producto-card").forEach(card => {
    const nombre = card.querySelector("h3").textContent.toLowerCase();
    const descripcion = card.querySelector("p").textContent.toLowerCase();
    const coincide = nombre.includes(texto) || descripcion.includes(texto);

    card.style.display = coincide ? "block" : "none";
  });
});


// Inicial
cargarProductos();

