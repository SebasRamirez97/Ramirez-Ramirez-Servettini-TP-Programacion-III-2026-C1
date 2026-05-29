const tabla = document.getElementById("tabla-carrito");
const totalHTML = document.getElementById("total");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
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

function sumarCantidad(index) {

    carrito[index].cantidad++;

    guardarCarrito();

    mostrarCarrito();
}

function restarCantidad(index) {

    carrito[index].cantidad--;

    if (carrito[index].cantidad <= 0) {

        carrito.splice(index, 1);
    }

    guardarCarrito();

    mostrarCarrito();
}

function eliminarProducto(index) {

    carrito.splice(index, 1);

    guardarCarrito();

    mostrarCarrito();
}

document.getElementById("comprar")
.addEventListener("click", () => {

    if (carrito.length === 0) {

        alert("El carrito está vacío");
        return;
    }

    const ticket = {

        fecha: new Date().toLocaleString(),

        productos: carrito,

        total: carrito.reduce(
            (acc, p) =>
                acc + p.precio * p.cantidad,
            0
        )
    };

    localStorage.setItem(
        "ticket",
        JSON.stringify(ticket)
    );

    localStorage.removeItem("carrito");

    window.location.href =
        "/Ramirez-Ramirez-Servettini-TP-Programacion-III-2026-C1/HTML/ticket.html";
});

mostrarCarrito();