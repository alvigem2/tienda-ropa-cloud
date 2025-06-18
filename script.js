// script.js
import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const contenedor = document.getElementById("productos");

async function cargarProductos() {
  const querySnapshot = await getDocs(collection(db, "productos"));
  querySnapshot.forEach((doc) => {
    const p = doc.data();
    contenedor.innerHTML += `
      <div class="producto">
        <img src="${p.imagen_url}" width="100%">
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <strong>${p.precio} Bs</strong>
      </div>
    `;
  });
}

cargarProductos();
