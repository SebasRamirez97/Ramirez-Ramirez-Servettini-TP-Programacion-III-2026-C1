const ticket =
JSON.parse(localStorage.getItem("ticket"));

const contenedor =
document.getElementById("ticket");

if (!ticket) {

    contenedor.innerHTML =
    "<h2>No existe ningún ticket</h2>";

} else {

    let html = `
    <h2>Fecha: ${ticket.fecha}</h2>
    <hr>
    `;

    ticket.productos.forEach(producto => {

        const subtotal =
        producto.precio * producto.cantidad;

        html += `
        <p>

            ${producto.nombre}

            | Cantidad: ${producto.cantidad}

            | Precio: $${producto.precio}

            | Subtotal: $${subtotal}

        </p>
        `;
    });

    html += `
    <hr>

    <h2>
        TOTAL: $${ticket.total}
    </h2>
    `;

    contenedor.innerHTML = html;

    localStorage.removeItem("ticket");
}