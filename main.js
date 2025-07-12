const API_URL = "http://localhost:8080/api/pedidos";

document.addEventListener("DOMContentLoaded", listarPedidos);
document.getElementById("pedidoForm").addEventListener("submit", guardarPedido);
document.getElementById("cancelarBtn").addEventListener("click", limpiarFormulario);

// --- Carrito de pedidos ---
let carrito = [];

// Botón de carrito en el header
const carritoHeaderBtn = document.getElementById("carritoHeaderBtn");
const carritoSection = document.getElementById("carritoSection");
let carritoVisible = false;
carritoHeaderBtn.addEventListener("click", () => {
    carritoVisible = !carritoVisible;
    carritoSection.style.display = carritoVisible && carrito.length > 0 ? "block" : "none";
});

// Contador de carrito en el header
const carritoCount = document.getElementById("carritoCount");
function actualizarCarritoCount() {
    if (carrito.length > 0) {
        carritoCount.textContent = carrito.length;
        carritoCount.style.display = "inline-block";
    } else {
        carritoCount.style.display = "none";
    }
}

// Botón para agregar al carrito
const agregarCarritoBtn = document.getElementById("agregarCarritoBtn");
agregarCarritoBtn.addEventListener("click", agregarAlCarrito);

function agregarAlCarrito() {
    const cliente = document.getElementById("cliente").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const total = document.getElementById("total").value.trim();
    if (!cliente || !descripcion || !total) {
        alert("Completa todos los campos para agregar al carrito.");
        return;
    }
    carrito.push({ cliente, descripcion, total });
    mostrarCarrito();
    actualizarCarritoCount();
    limpiarFormulario();
}

function mostrarCarrito() {
    const section = document.getElementById("carritoSection");
    const tbody = document.getElementById("carritoTable");
    if (carrito.length === 0) {
        section.style.display = "none";
        carritoVisible = false;
        actualizarCarritoCount();
        return;
    }
    if (carritoVisible) {
        section.style.display = "block";
    }
    tbody.innerHTML = "";
    carrito.forEach((pedido, idx) => {
        tbody.innerHTML += `
            <tr>
                <td>${pedido.cliente}</td>
                <td>${pedido.descripcion}</td>
                <td>${pedido.total}</td>
                <td><button class='btn btn-danger btn-sm' onclick='eliminarDelCarrito(${idx})'>Eliminar</button></td>
            </tr>
        `;
    });
    actualizarCarritoCount();
}

window.eliminarDelCarrito = function(idx) {
    carrito.splice(idx, 1);
    mostrarCarrito();
    actualizarCarritoCount();
    if (carrito.length === 0) {
        carritoSection.style.display = "none";
        carritoVisible = false;
    }
};

// Botón para enviar todos los pedidos del carrito
const enviarCarritoBtn = document.getElementById("enviarCarritoBtn");
enviarCarritoBtn.addEventListener("click", enviarCarrito);

function enviarCarrito() {
    if (carrito.length === 0) return;
    Promise.all(carrito.map(pedido =>
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        })
    )).then(() => {
        carrito = [];
        mostrarCarrito();
        listarPedidos();
        alert("Pedidos enviados correctamente.");
    });
}
// --- Fin carrito ---

function listarPedidos() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("pedidosTable");
            tbody.innerHTML = "";
            data.forEach(pedido => {
                tbody.innerHTML += `
                    <tr>
                        <td>${pedido.cliente}</td>
                        <td>${pedido.descripcion}</td>
                        <td>${pedido.total}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editarPedido(${pedido.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarPedido(${pedido.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function guardarPedido(e) {
    e.preventDefault();
    const id = document.getElementById("pedidoId").value;
    const cliente = document.getElementById("cliente").value;
    const descripcion = document.getElementById("descripcion").value;
    const total = document.getElementById("total").value;

    const pedido = { cliente, descripcion, total };

    if (id) {
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        }).then(() => {
            limpiarFormulario();
            listarPedidos();
        });
    } else {
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        }).then(() => {
            limpiarFormulario();
            listarPedidos();
        });
    }
}

function editarPedido(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(pedido => {
            document.getElementById("pedidoId").value = pedido.id;
            document.getElementById("cliente").value = pedido.cliente;
            document.getElementById("descripcion").value = pedido.descripcion;
            document.getElementById("total").value = pedido.total;
            document.getElementById("cancelarBtn").style.display = "inline-block";
        });
}

function eliminarPedido(id) {
    if (confirm("¿Seguro que deseas eliminar este pedido?")) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => listarPedidos());
    }
}

function limpiarFormulario() {
    document.getElementById("pedidoId").value = "";
    document.getElementById("cliente").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("total").value = "";
    document.getElementById("cancelarBtn").style.display = "none";
} 