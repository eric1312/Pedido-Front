const API_URL = "http://localhost:8080/api/pedidos";    //URL base para las peticiones al backend

// --- Inicialización de la aplicación ---
document.addEventListener("DOMContentLoaded", listarPedidos);
// Configuración del formulario de pedidos
document.getElementById("pedidoForm").addEventListener("submit", guardarPedido);
// Botón para cancelar la edición de un pedido
document.getElementById("cancelarBtn").addEventListener("click", limpiarFormulario);

// --- Carrito de pedidos ---
let carrito = [];   // Array para almacenar los pedidos en el carrito    

// Botón de carrito en el header
const carritoHeaderBtn = document.getElementById("carritoHeaderBtn");   // Botón para mostrar/ocultar el carrito
const carritoSection = document.getElementById("carritoSection");   // Sección del carrito que se muestra/oculta
let carritoVisible = false; // Estado del carrito (visible o no)
carritoHeaderBtn.addEventListener("click", () => {  // Evento para mostrar/ocultar el carrito
    carritoVisible = !carritoVisible; // Cambia el estado de visibilidad del carrito
    carritoSection.style.display = carritoVisible && carrito.length > 0 ? "block" : "none"; // Muestra el carrito si está visible y tiene pedidos
});

// Contador de carrito en el header
const carritoCount = document.getElementById("carritoCount"); // Elemento que muestra la cantidad de pedidos en el carrito
function actualizarCarritoCount() { // Actualiza el contador de pedidos en el carrito
    if (carrito.length > 0) {   // Si hay pedidos en el carrito
        carritoCount.textContent = carrito.length;  // Actualiza el texto del contador con la cantidad de pedidos
        carritoCount.style.display = "inline-block"; // Muestra el contador
    } else {    // Si no hay pedidos en el carrito
        carritoCount.style.display = "none";    // Oculta el contador
    }
}

// Botón para agregar al carrito
const agregarCarritoBtn = document.getElementById("agregarCarritoBtn");
agregarCarritoBtn.addEventListener("click", agregarAlCarrito);  // Evento para agregar un pedido al carrito

function agregarAlCarrito() {   // Función para agregar un pedido al carrito
    const cliente = document.getElementById("cliente").value.trim();    // Obtiene el valor del campo cliente
    const descripcion = document.getElementById("descripcion").value.trim();    // Obtiene el valor del campo descripción
    const total = document.getElementById("total").value.trim();      // Obtiene el valor del campo total
    if (!cliente || !descripcion || !total) {   // Verifica si todos los campos están completos
        alert("Completa todos los campos para agregar al carrito.");    // Si no, muestra un mensaje de alerta
        return;   // Sale de la función si los campos no están completos
    }
    carrito.push({ cliente, descripcion, total });  // Agrega el pedido al carrito
    mostrarCarrito();   // Muestra el carrito actualizado
    actualizarCarritoCount();   // Actualiza el contador de pedidos en el carrito
    limpiarFormulario();    // Limpia el formulario de pedidos
}

function mostrarCarrito() { // Función para mostrar el contenido del carrito
    const section = document.getElementById("carritoSection");  // Obtiene la sección del carrito
    const tbody = document.getElementById("carritoTable");  // Obtiene el cuerpo de la tabla del carrito
    if (carrito.length === 0) { // Si el carrito está vacío
        section.style.display = "none"; // Oculta la sección del carrito
        carritoVisible = false; // Cambia el estado de visibilidad del carrito
        actualizarCarritoCount();   // Actualiza el contador de pedidos en el carrito
        return; // Sale de la función si el carrito está vacío
    }
    if (carritoVisible) {   // Si el carrito está visible
        section.style.display = "block";    // Muestra la sección del carrito
    }   
    tbody.innerHTML = "";   // Limpia el contenido del cuerpo de la tabla del carrito
    carrito.forEach((pedido, idx) => {  // Itera sobre cada pedido en el carrito
        tbody.innerHTML += `    
            <tr>
                <td>${pedido.cliente}</td>
                <td>${pedido.descripcion}</td>
                <td>${pedido.total}</td>
                <td><button class='btn btn-danger btn-sm' onclick='eliminarDelCarrito(${idx})'>Eliminar</button></td>   
            </tr>
        `;
    });
    actualizarCarritoCount();   // Actualiza el contador de pedidos en el carrito
}

window.eliminarDelCarrito = function(idx) { // Función para eliminar un pedido del carrito
    carrito.splice(idx, 1); // Elimina el pedido del carrito usando su índice
    mostrarCarrito();   // Muestra el carrito actualizado
    actualizarCarritoCount();   // Actualiza el contador de pedidos en el carrito
    if (carrito.length === 0) { // Si el carrito está vacío después de eliminar un pedido
        carritoSection.style.display = "none";  // Oculta la sección del carrito
        carritoVisible = false; // Cambia el estado de visibilidad del carrito
    }
};

// Botón para enviar todos los pedidos del carrito
const enviarCarritoBtn = document.getElementById("enviarCarritoBtn");   // Botón para enviar los pedidos del carrito al backend
enviarCarritoBtn.addEventListener("click", enviarCarrito);  // Evento para enviar los pedidos del carrito

function enviarCarrito() {  // Función para enviar los pedidos del carrito al backend
    if (carrito.length === 0) return;   // Si el carrito está vacío, no hace nada
    Promise.all(carrito.map(pedido =>   // Envía cada pedido del carrito al backend
        fetch(API_URL, {     // Configura la petición para enviar el pedido
            method: "POST",     // Método POST para enviar el pedido
            headers: { "Content-Type": "application/json" }, // Cabecera para indicar que el cuerpo es JSON
            body: JSON.stringify(pedido)    // Convierte el pedido a formato JSON
        })
    )).then(() => { // Una vez que todos los pedidos se han enviado
        carrito = [];   // Limpia el carrito
        mostrarCarrito();   // Muestra el carrito actualizado (vacío)
        listarPedidos();    // Actualiza la lista de pedidos en la tabla
        alert("Pedidos enviados correctamente.");   // Muestra un mensaje de éxito
    });
}
// --- Fin carrito ---

function listarPedidos() {  // Función para listar los pedidos desde el backend
    fetch(API_URL)  // Realiza una petición GET al backend para obtener los pedidos
        .then(res => res.json())    // Convierte la respuesta a formato JSON
        .then(data => {   // Una vez que se obtienen los datos
            const tbody = document.getElementById("pedidosTable");  // Obtiene el cuerpo de la tabla donde se mostrarán los pedidos
            tbody.innerHTML = "";   // Limpia el contenido del cuerpo de la tabla
            data.forEach(pedido => {    // Itera sobre cada pedido recibido
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

function guardarPedido(e) { // Función para guardar un pedido (crear o actualizar)
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
    const id = document.getElementById("pedidoId").value;   // Obtiene el ID del pedido (si existe)
    const cliente = document.getElementById("cliente").value;   // Obtiene el valor del campo cliente
    const descripcion = document.getElementById("descripcion").value;   // Obtiene el valor del campo descripción
    const total = document.getElementById("total").value;   // Obtiene el valor del campo total

    const pedido = { cliente, descripcion, total }; // Crea un objeto pedido con los valores obtenidos

    if (id) {   // Si el ID existe, significa que se está actualizando un pedido
        fetch(`${API_URL}/${id}`, {   // Realiza una petición PUT para actualizar el pedido
            method: "PUT",  // Método PUT para actualizar el pedido
            headers: { "Content-Type": "application/json" },    // Cabecera para indicar que el cuerpo es JSON
            body: JSON.stringify(pedido)    // Convierte el pedido a formato JSON
        }).then(() => {   // Una vez que se actualiza el pedido
            limpiarFormulario();    // Limpia el formulario de pedidos
            listarPedidos();    // Actualiza la lista de pedidos en la tabla
        }); 
    } else {    // Si el ID no existe, significa que se está creando un nuevo pedido
        fetch(API_URL, {    // Realiza una petición POST para crear un nuevo pedido
            method: "POST", // Método POST para crear un nuevo pedido
            headers: { "Content-Type": "application/json" },    // Cabecera para indicar que el cuerpo es JSON
            body: JSON.stringify(pedido)    // Convierte el pedido a formato JSON
        }).then(() => {   // Una vez que se crea el nuevo pedido
            limpiarFormulario();    // Limpia el formulario de pedidos
            listarPedidos();    // Actualiza la lista de pedidos en la tabla
        });
    }
}

function editarPedido(id) { // Función para editar un pedido existente
    fetch(`${API_URL}/${id}`)   // Realiza una petición GET para obtener los detalles del pedido a editar
        .then(res => res.json())    // Convierte la respuesta a formato JSON
        .then(pedido => {   // Una vez que se obtienen los detalles del pedido
            document.getElementById("pedidoId").value = pedido.id;  // Establece el ID del pedido en el formulario
            document.getElementById("cliente").value = pedido.cliente;  // Establece el cliente del pedido en el formulario
            document.getElementById("descripcion").value = pedido.descripcion;  // Establece la descripción del pedido en el formulario
            document.getElementById("total").value = pedido.total;  // Establece el total del pedido en el formulario
            document.getElementById("cancelarBtn").style.display = "inline-block";  // Muestra el botón de cancelar edición
        });
}

function eliminarPedido(id) {   // Función para eliminar un pedido existente
    if (confirm("¿Seguro que deseas eliminar este pedido?")) {  // Pregunta al usuario si está seguro de eliminar el pedido
        fetch(`${API_URL}/${id}`, { method: "DELETE" }) // Realiza una petición DELETE para eliminar el pedido
            .then(() => listarPedidos());   // Una vez que se elimina el pedido, actualiza la lista de pedidos en la tabla
    }
}

function limpiarFormulario() {  // Función para limpiar el formulario de pedidos
    document.getElementById("pedidoId").value = "";     // Limpia el campo del ID del pedido
    document.getElementById("cliente").value = "";  // Limpia el campo del cliente
    document.getElementById("descripcion").value = "";  // Limpia el campo de la descripción
    document.getElementById("total").value = "";    // Limpia el campo del total
    document.getElementById("cancelarBtn").style.display = "none";  // Oculta el botón de cancelar edición
} 