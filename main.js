// Variables y Objetos
const paquetes = [
    { nivel: "Principiante", precio: 10000, descripcion: "Conceptos básicos como posicionamiento y manejo del balón." },
    { nivel: "Intermedio", precio: 15000, descripcion: "Estrategias de rotación, control aéreo, y tiros avanzados." },
    { nivel: "Avanzado", precio: 20000, descripcion: "Técnicas de flip resets, ceiling shots y jugadas en equipo." }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//  Funciones de manipulación del DOM
function mostrarPaquetes(paquetesMostrar) {
    const container = document.getElementById("paquetes-container");
    container.innerHTML = ""; // Limpiar contenido previo

    paquetesMostrar.forEach((paquete, index) => {
        const div = document.createElement("div");
        div.classList.add("paquete");
        div.innerHTML = `
            <h3>${paquete.nivel}</h3>
            <p>${paquete.descripcion}</p>
            <p>Precio: $${paquete.precio}</p>
            <button class="btn" data-index="${index}">Agregar al carrito</button>
        `;
        container.appendChild(div);
    });

    // Asignar eventos a los botones
    const botones = container.querySelectorAll(".btn");
    botones.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            agregarAlCarrito(paquetes[index]);
        });
    });
}

function mostrarCarrito() {
    const container = document.getElementById("carrito-container");
    container.innerHTML = ""; // Limpiar contenido previo

    if (carrito.length === 0) {
        container.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    let total = 0;
    carrito.forEach((item, index) => {
        total += item.precio;
        const div = document.createElement("div");
        div.classList.add("carrito-item");
        div.innerHTML = `
            <p>${item.nivel} - $${item.precio}</p>
            <button class="btn" data-index="${index}">Eliminar</button>
        `;
        container.appendChild(div);
    });

    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;
    container.appendChild(totalDiv);

    // Asignar eventos a los botones
    const botones = container.querySelectorAll(".btn");
    botones.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            eliminarDelCarrito(index);
        });
    });
}

// Funciones de lógica
function agregarAlCarrito(paquete) {
    if (carrito.some(item => item.nivel === paquete.nivel)) {
        alert("El paquete ya está en el carrito.");
        return;
    }
    carrito.push(paquete);
    guardarCarrito();
    mostrarCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Eventos de usuario
document.getElementById("filtrarPaquetesBtn").addEventListener("click", () => {
    const min = parseInt(document.getElementById("minPrecio").value) || 0;
    const max = parseInt(document.getElementById("maxPrecio").value) || Infinity;
    const filtrados = paquetes.filter(p => p.precio >= min && p.precio <= max);
    mostrarPaquetes(filtrados);
});

document.getElementById("vaciarCarritoBtn").addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
});

// Carga inicial
document.addEventListener("DOMContentLoaded", () => {
    mostrarPaquetes(paquetes);
    mostrarCarrito();
});
