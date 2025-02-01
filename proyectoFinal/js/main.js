

// Variables y estado inicial
let paquetes = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para obtener paquetes desde el JSON
async function cargarPaquetes() {
    try {
        const respuesta = await fetch("paquetes.json");
        if (!respuesta.ok) {
            throw new Error("Error al cargar los paquetes");
        }
        paquetes = await respuesta.json();
        mostrarPaquetes(paquetes);
    } catch (error) {
        console.error("Hubo un problema al cargar los paquetes:", error);
    }
}

// Función para mostrar paquetes en el DOM
function mostrarPaquetes(paquetesMostrar) {
    const container = document.getElementById("paquetes-container");
    container.innerHTML = "";

    paquetesMostrar.forEach((paquete, index) => {
        const div = document.createElement("div");
        div.classList.add("paquete", "animate__animated", "animate__fadeIn");
        div.innerHTML = `
            <h3>${paquete.nivel}</h3>
            <p>${paquete.descripcion}</p>
            <p>Precio: $${paquete.precio}</p>
            <button class="btn" data-index="${index}">Agregar al carrito</button>
        `;
        container.appendChild(div);
    });

    // Eventos de agregar al carrito
    document.querySelectorAll(".paquete .btn").forEach(boton => {
        boton.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            agregarAlCarrito(paquetes[index]);
        });
    });
}

// Función para mostrar el carrito
function mostrarCarrito() {
    const container = document.getElementById("carrito-container");
    container.innerHTML = "";

    if (carrito.length === 0) {
        container.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    let total = 0;
    carrito.forEach((item, index) => {
        total += item.precio;
        const div = document.createElement("div");
        div.classList.add("carrito-item", "animate__animated", "animate__fadeIn");
        div.innerHTML = `
            <p>${item.nivel} - $${item.precio}</p>
            <button class="btn eliminar" data-index="${index}">Eliminar</button>
        `;
        container.appendChild(div);
    });

    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;
    container.appendChild(totalDiv);

    // Eventos para eliminar del carrito
    document.querySelectorAll(".carrito-item .eliminar").forEach(boton => {
        boton.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            eliminarDelCarrito(index);
        });
    });
}

// Función para agregar al carrito
function agregarAlCarrito(paquete) {
    if (carrito.some(item => item.nivel === paquete.nivel)) {
        Swal.fire({
            icon: "warning",
            title: "Paquete ya agregado",
            text: "Este paquete ya está en tu carrito",
        });
        return;
    }
    carrito.push(paquete);
    guardarCarrito();
    mostrarCarrito();
    Swal.fire({
        icon: "success",
        title: "Agregado",
        text: "El paquete se agregó al carrito",
    });
}

// Función para eliminar del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    mostrarCarrito();
    Swal.fire({
        icon: "info",
        title: "Eliminado",
        text: "El paquete fue eliminado del carrito",
    });
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Filtrado de paquetes
document.getElementById("filtrarPaquetesBtn").addEventListener("click", () => {
    const min = parseInt(document.getElementById("minPrecio").value) || 0;
    const max = parseInt(document.getElementById("maxPrecio").value) || Infinity;
    const filtrados = paquetes.filter(p => p.precio >= min && p.precio <= max);
    mostrarPaquetes(filtrados);
});

// Vaciar carrito
document.getElementById("vaciarCarritoBtn").addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
    Swal.fire({
        icon: "error",
        title: "Carrito vaciado",
        text: "Has vaciado el carrito",
    });
});

// Carga inicial de datos
document.addEventListener("DOMContentLoaded", () => {
    cargarPaquetes();
    mostrarCarrito();
});
