// ===============================
// CATEGORIAS
// ===============================

const botones = document.querySelectorAll('.btn-categoria');

botones.forEach(boton => {

    boton.addEventListener('click', function () {

        const item = this.parentNode;

        item.classList.toggle('activo');

        if (item.classList.contains('activo')) {

            setTimeout(() => {

                item.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });

            }, 300);
        }
    });
});

// ===============================
// MENU LATERAL
// ===============================

const linksMenu = document.querySelectorAll('.menu-lateral a');

linksMenu.forEach(link => {

    link.addEventListener('click', function () {

        const idDestino = this.getAttribute('href');

        if (idDestino.startsWith('#')) {

            const seccion = document.querySelector(idDestino);

            if (seccion) {

                seccion.classList.add('activo');
            }
        }
    });
});

// ===============================
// BOTONES + Y -
// ===============================

const selectoresCantidad =
document.querySelectorAll(".selector-cantidad");

selectoresCantidad.forEach(selector => {

    const botones =
    selector.querySelectorAll(".btn-cantidad");

    const btnMenos = botones[0];
    const btnMas = botones[1];

    const numero =
    selector.querySelector(".cantidad-numero");

    btnMas.addEventListener("click", () => {

        let cantidad =
        Number(numero.textContent);

        cantidad++; // <-- CORREGIDO: Ahora usa 'cantidad' en lugar de 'amount'

        numero.textContent = cantidad;
    });

    btnMenos.addEventListener("click", () => {

        let cantidad =
        Number(numero.textContent);

        if (cantidad > 0) {

            cantidad--;

            numero.textContent = cantidad;
        }
    });

});

// ===============================
// AGREGAR AL CARRITO
// ===============================

const botonesAgregar =
document.querySelectorAll(".btn-agregar");

botonesAgregar.forEach(boton => {

    boton.addEventListener("click", function () {

        const card =
        boton.closest(".producto-card");

        const nombre =
        boton.dataset.producto;

        const precio =
        Number(boton.dataset.precio);

        const cantidad =
        Number(
            card.querySelector(".cantidad-numero")
            .textContent
        );

        if (cantidad <= 0) {

            alert("Seleccione una cantidad");

            return;
        }

        let carrito =
        JSON.parse(
            localStorage.getItem("carrito")
        ) || [];

        const productoExistente =
        carrito.find(
            producto => producto.nombre === nombre
        );

        if (productoExistente) {

            productoExistente.cantidad += cantidad;

        } else {

            carrito.push({

                nombre: nombre,
                precio: precio,
                cantidad: cantidad
            });
        }

        localStorage.setItem(
            "carrito",
            JSON.stringify(carrito)
        );

        // Reinicia contador

        card.querySelector(
            ".cantidad-numero"
        ).textContent = 0;

        // Sonido

        const btnSonido =
        card.querySelector(".arma-btn");

        if (
            btnSonido &&
            btnSonido.dataset.sonido
        ) {

            const audio =
            new Audio(
                btnSonido.dataset.sonido
            );

            audio.volume = 1;

            audio.play();
        }

        alert(`"${nombre}" (x${cantidad}) agregado al carrito.`);

    });

});