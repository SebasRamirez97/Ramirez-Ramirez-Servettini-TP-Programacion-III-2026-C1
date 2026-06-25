const tabla = document.getElementById("tabla-carrito");
const totalHTML = document.getElementById("total");

// Cambiamos localStorage por la lectura de los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const clienteActual = urlParams.get('cliente') || 'Cliente Anónimo';
const productosParam = urlParams.get('productos');

let carrito = [];

if (productosParam) {
    try {
        carrito = JSON.parse(decodeURIComponent(productosParam));
    } catch (e) {
        carrito = [];
    }
}

function guardarCarrito() {
    // Reemplazamos localStorage por la actualización de la barra de direcciones de la URL
    const nuevosProductos = encodeURIComponent(JSON.stringify(carrito));
    const nuevaUrl = `${window.location.pathname}?cliente=${encodeURIComponent(clienteActual)}&productos=${nuevosProductos}`;
    window.history.replaceState(null, '', nuevaUrl);
}

function mostrarCarrito() {

    tabla.innerHTML = "";

    let total = 0;

    if (carrito.length === 0) {

        tabla.innerHTML = `
        <tr>
            <td colspan="5">
                El carrito está vacío
            </td>
        </tr>
        `;

        totalHTML.textContent = "0";
        return;
    }

    carrito.forEach((producto, index) => {

        const subtotal =
            producto.precio * producto.cantidad;

        total += subtotal;

        tabla.innerHTML += `
        <tr>

            <td>${producto.nombre}</td>

            <td>$${producto.precio}</td>

            <td>

                <button onclick="restarCantidad(${index})">
                    -
                </button>

                ${producto.cantidad}

                <button onclick="sumarCantidad(${index})">
                    +
                </button>

            </td>

            <td>
                $${subtotal}
            </td>

            <td>

                <button onclick="eliminarProducto(${index})">
                    Eliminar
                </button>

            </td>

        </tr>
        `;
    });

    totalHTML.textContent = total;
}

// Agregamos window. para que tus onclick inline del HTML las encuentren sin error
window.sumarCantidad = function(index) {

    carrito[index].cantidad++;

    guardarCarrito();

    mostrarCarrito();
}

window.restarCantidad = function(index) {

    carrito[index].cantidad--;

    if (carrito[index].cantidad <= 0) {

        carrito.splice(index, 1);
    }

    guardarCarrito();

    mostrarCarrito();
}

window.eliminarProducto = function(index) {

    carrito.splice(index, 1);

    guardarCarrito();

    mostrarCarrito();
}

document.getElementById("comprar")
.addEventListener("click", async () => {

    if (carrito.length === 0) {

        alert("El carrito está vacío");
        return;
    }

    // Cambiamos el guardado en localStorage por la petición POST directa a tu API de Sequelize
    const totalCompra = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

    const datosCompra = {
        nombre_cliente: clienteActual,
        precio_total: totalCompra,
        productos: carrito.map(p => ({
            id: parseInt(p.id),
            cantidad: p.cantidad
        }))
    };

    try {
        const respuesta = await fetch('http://localhost:3000/api/ventas/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosCompra)
        });

        if (respuesta.ok) {
            alert(`¡Compra registrada con éxito para el cliente: ${clienteActual}!`);
            window.location.href = 'ventas.html';
        } else {
            alert('Hubo un error al procesar el guardado en el servidor.');
        }
    } catch (error) {
        console.error("Error al conectar con el backend:", error);
        alert('No se pudo establecer conexión con la API.');
    }
});

mostrarCarrito();