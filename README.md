# CRUD de Pedidos (Frontend)

Este proyecto es una aplicación web simple para la gestión de pedidos, desarrollada con HTML, CSS, JavaScript y Bootstrap. Permite crear, listar, editar y eliminar pedidos, así como agregar pedidos a un carrito local antes de enviarlos al backend.

## Características

- **Crear, editar y eliminar pedidos**
- **Agregar pedidos a un carrito local**
- **Enviar todos los pedidos del carrito al backend**
- **Interfaz moderna y responsiva con Bootstrap y estilos personalizados**

## Estructura del proyecto

```**
├── index.html        # Interfaz principal de la aplicación
├── main.js           # Lógica de la aplicación (JS)
├── styles.css        # Estilos personalizados
```

## Requisitos

- Servidor backend corriendo en `http://localhost:8080/api/pedidos` (puedes usar cualquier backend compatible con la API REST de pedidos)
- Navegador web moderno

## Uso

1. Clona o descarga este repositorio.
2. Asegúrate de tener el backend corriendo en `http://localhost:8080/api/pedidos`.
3. Abre `index.html` en tu navegador.
4. Utiliza el formulario para crear pedidos o agregarlos al carrito.
5. Envía los pedidos del carrito al backend usando el botón correspondiente.

## API esperada

La aplicación espera que el backend exponga los siguientes endpoints:

- `GET    /api/pedidos`         → Lista todos los pedidos
- `POST   /api/pedidos`         → Crea un nuevo pedido
- `GET    /api/pedidos/{id}`    → Obtiene un pedido por ID
- `PUT    /api/pedidos/{id}`    → Actualiza un pedido existente
- `DELETE /api/pedidos/{id}`    → Elimina un pedido

## Personalización

- Puedes modificar los estilos en `styles.css` para adaptar la apariencia a tus necesidades.
- El código JS es fácilmente extensible para nuevas funcionalidades.

## Créditos

- Bootstrap 5 para estilos base.

---

<!-- ¡Contribuciones y sugerencias son bienvenidas! -->