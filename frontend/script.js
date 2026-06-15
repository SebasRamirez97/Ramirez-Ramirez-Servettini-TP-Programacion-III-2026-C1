document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. CAPTURA DE ELEMENTOS DEL DOM
    // =========================================================================
    const nombreCliente = document.getElementById('input-nombre');
    const btnComprar = document.getElementById('btn-comprar');
    const btnCatPowerups = document.getElementById('btn-cat-powerups');
    const btnCatVehiculos = document.getElementById('btn-cat-vehiculos');
    const contenedorProductos = document.getElementById('contenedor-productos');
    const tituloCatalogo = document.getElementById('titulo-catalogo');
    const btnCarrito = document.getElementById('btn-carrito'); 
    const tablaCarrito = document.getElementById('tabla-carrito');
    const totalHTML = document.getElementById('total');
    const btnFinalizarCompra = document.getElementById('comprar');

    // Elementos de Ticket
    const ticketOperacion = document.getElementById('ticket-operacion');
    const ticketCliente = document.getElementById('ticket-cliente');
    const ticketFecha = document.getElementById('ticket-fecha');
    const ticketProductosBody = document.getElementById('ticket-productos-body');
    const ticketTotal = document.getElementById('ticket-total');

    // Navegación
    const btnTema = document.getElementById('btn-tema');      
    const btnVolverInicio = document.getElementById('btn-volver-inicio');
    const btnVolverCategorias = document.getElementById('btn-volver-categorias');
    
    let articulos = [];
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // =========================================================================
    // 2. SISTEMA DE TEMAS (Sol / Luna)
    // =========================================================================
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado === 'oscuro') {
        document.body.classList.add('dark-mode');
        if (btnTema) {
            btnTema.innerHTML = '☀️'; 
            btnTema.classList.remove('btn-dark');
            btnTema.classList.add('btn-light');
        }
    }

    if (btnTema) {
        btnTema.addEventListener('click', () => {
            const modoOscuroActivo = document.body.classList.toggle('dark-mode');
            if (modoOscuroActivo) {
                btnTema.innerHTML = '☀️'; 
                btnTema.classList.remove('btn-dark');
                btnTema.classList.add('btn-light');
                localStorage.setItem('tema', 'oscuro');
            } else {
                btnTema.innerHTML = '🌙'; 
                btnTema.classList.remove('btn-light');
                btnTema.classList.add('btn-dark');
                localStorage.setItem('tema', 'claro');
            }
        });
    }

    // =========================================================================
    // 3. CATEGORÍAS NAVEGACIÓN
    // =========================================================================
    if (btnCatPowerups) {
        btnCatPowerups.addEventListener('click', () => { location.href = "catalogo.html?categoria=powerups"; });
    }
    if (btnCatVehiculos) {
        btnCatVehiculos.addEventListener('click', () => { location.href = "catalogo.html?categoria=vehiculos"; });
    }

    // =========================================================================
    // 4. FLUJOS GENERALES
    // =========================================================================
    if (btnComprar) {
        btnComprar.addEventListener('click', () => {
            if (nombreCliente.value.trim() === '') {
                const modal = new bootstrap.Modal(document.getElementById('modalNombre'));
                modal.show();
                return;
            }
            localStorage.setItem('nombreCliente', nombreCliente.value.trim());
            location.href = "categorias.html";
        });
    }

    if (btnVolverInicio) {
        btnVolverInicio.addEventListener('click', () => {
            localStorage.removeItem('nombreCliente');
            localStorage.removeItem('ticketFinal');
            location.href = "index.html";
        });
    }

    if (btnVolverCategorias) {
        btnVolverCategorias.addEventListener('click', () => { location.href = "categorias.html"; });
    }

    if (btnCarrito) {
        btnCarrito.addEventListener('click', () => { location.href = "carrito.html"; });
    }

    // =========================================================================
    // 5. RENDERS DEL CATÁLOGO
    // =========================================================================
    if (tituloCatalogo && contenedorProductos) {
        fetch('./articulos.json')
            .then(response => response.json())
            .then(data => {
                articulos = data;
                if (btnCarrito) btnCarrito.classList.remove('d-none');
                const params = new URLSearchParams(window.location.search);
                const categoria = params.get("categoria");
                if (categoria) {
                    mostrarCategoria(categoria, categoria === "powerups" ? "Power Ups" : "Vehículos");
                }
            });
    }

    function mostrarCategoria(categoriaFiltro, textoTitulo) {
        tituloCatalogo.textContent = textoTitulo;
        contenedorProductos.innerHTML = "";
        
        const filtrados = articulos.filter(item => item.categoria === categoriaFiltro && item.activo !== false);

        filtrados.forEach(producto => {
            const article = document.createElement('article');
            article.classList.add('producto-card');

            article.innerHTML = `
                <img src="${producto.imagen || 'https://via.placeholder.com/200x150?text=Sin+Imagen'}" alt="${producto.nombre}" class="producto-img">
                <h4>${producto.nombre}</h4>
                <p class="text-muted small">${producto.descripcion}</p>
                <p class="fs-4 fw-bold text-success">$${producto.precio}</p>
                <div class="selector-cantidad">
                    <button class="btn-cantidad menos">-</button>
                    <span class="cantidad-numero fw-bold px-2">1</span>
                    <button class="btn-cantidad mas">+</button>
                </div>
                <button class="btn btn-danger w-100 mt-2 btn-agregar">Agregar al carrito</button>
            `;

            const btnMas = article.querySelector('.mas');
            const btnMenos = article.querySelector('.menos');
            const spanCant = article.querySelector('.cantidad-numero');
            const btnAgregar = article.querySelector('.btn-agregar');

            btnMas.addEventListener('click', () => { spanCant.textContent = parseInt(spanCant.textContent) + 1; });
            btnMenos.addEventListener('click', () => {
                let actual = parseInt(spanCant.textContent);
                if (actual > 1) spanCant.textContent = actual - 1;
            });

            btnAgregar.addEventListener('click', () => {
                const cantidadAAgregar = parseInt(spanCant.textContent);
                carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                const existente = carrito.find(item => item.id === producto.id);

                if (existente) {
                    existente.cantidad += cantidadAAgregar;
                } else {
                    carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: cantidadAAgregar });
                }

                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarGloboFlotante(`+${cantidadAAgregar} ${producto.nombre} agregado`);

                btnAgregar.textContent = '¡Agregado!';
                btnAgregar.classList.replace('btn-danger', 'btn-success');
                setTimeout(() => {
                    btnAgregar.textContent = 'Agregar al carrito';
                    btnAgregar.classList.replace('btn-success', 'btn-danger');
                    spanCant.textContent = '1';
                }, 1000);
            });

            contenedorProductos.appendChild(article);
        });
    }

    function mostrarGloboFlotante(mensaje) {
        const contenedor = document.querySelector('.contenedor-carrito-popup');
        if (!contenedor) return;
        const viejo = contenedor.querySelector('.globo-agregado');
        if (viejo) viejo.remove();

        const globo = document.createElement('div');
        globo.classList.add('globo-agregado');
        globo.textContent = mensaje;
        contenedor.appendChild(globo);

        setTimeout(() => {
            globo.style.transition = "opacity 0.3s ease";
            globo.style.opacity = "0";
            setTimeout(() => globo.remove(), 300);
        }, 2000);
    }

    const botonesNavLateral = document.querySelectorAll('.nav-categoria');
    if (botonesNavLateral.length > 0) {
        botonesNavLateral.forEach(b => {
            b.addEventListener('click', (e) => {
                location.href = `catalogo.html?categoria=${e.target.getAttribute('data-categoria')}`;
            });
        });
    }

    // =========================================================================
    // 6. LÓGICA DEL CARRITO (CON MODAL MODERNO REEMPLAZANDO ALERT DE IMAGE_A8E817.PNG)
    // =========================================================================
    function guardarCarritoYRenderizar() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
    }

    function mostrarCarrito() {
        if (!tablaCarrito || !totalHTML) return;
        tablaCarrito.innerHTML = "";
        let total = 0;

        if (carrito.length === 0) {
            tablaCarrito.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">El carrito está vacío</td></tr>`;
            totalHTML.textContent = "0";
            return;
        }

        carrito.forEach((p, idx) => {
            const sub = p.precio * p.cantidad;
            total += sub;
            tablaCarrito.innerHTML += `
            <tr>
                <td class="fw-medium">${p.nombre}</td>
                <td>$${p.precio}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-dark btn-cantidad-tabla me-2" onclick="restarCantidad(${idx})">-</button>
                    <span class="fw-bold px-1">${p.cantidad}</span>
                    <button class="btn btn-sm btn-dark btn-cantidad-tabla ms-2" onclick="sumarCantidad(${idx})">+</button>
                </td>
                <td class="fw-semibold text-success">$${sub}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger px-3" onclick="eliminarProducto(${idx})">Eliminar</button>
                </td>
            </tr>`;
        });
        totalHTML.textContent = total;
    }

    window.sumarCantidad = function(idx) { carrito[idx].cantidad += 1; guardarCarritoYRenderizar(); };
    window.restarCantidad = function(idx) {
        carrito[idx].cantidad -= 1;
        if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);
        guardarCarritoYRenderizar();
    };
    window.eliminarProducto = function(idx) { carrito.splice(idx, 1); guardarCarritoYRenderizar(); };

    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener("click", () => {
            const modalEl = document.getElementById('modalCarritoAviso');
            const modalMsg = document.getElementById('modalCarritoMensaje');
            const btnCanc = document.getElementById('btnModalCancelar');
            const btnConf = document.getElementById('btnModalConfirmar');
            
            if (!modalEl || !modalMsg) return;
            const bModal = new bootstrap.Modal(modalEl);

            // Caso 1: Intentar pagar sin productos (Sustituye la alerta de image_a8e817.png)
            if (carrito.length === 0) {
                modalMsg.textContent = "El carrito está vacío. ¡Agregá artículos antes de confirmar!";
                btnCanc.textContent = "Entendido";
                btnConf.classList.add('d-none'); 
                bModal.show();
                return;
            }

            // Caso 2: Confirmación con Modal estético
            modalMsg.textContent = "¿Está seguro de que desea confirmar la compra en este autoservicio?";
            btnCanc.textContent = "Cancelar";
            btnConf.classList.remove('d-none');

            btnConf.onclick = () => {
                bModal.hide();
                const nroOp = Math.floor(1000000000000 + Math.random() * 9000000000000);
                const ticket = {
                    nroOperacion: nroOp,
                    cliente: localStorage.getItem('nombreCliente') || 'Cliente Anónimo',
                    fecha: new Date().toLocaleString('es-AR'),
                    productos: carrito,
                    total: carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0)
                };
                localStorage.setItem("ticketFinal", JSON.stringify(ticket));
                localStorage.removeItem("carrito");
                window.location.href = "ticket.html";
            };
            bModal.show();
        });
    }

    if (tablaCarrito) mostrarCarrito();

    // =========================================================================
    // 7. LÓGICA DEL TICKET
    // =========================================================================
    if (ticketProductosBody) {
        const datos = JSON.parse(localStorage.getItem('ticketFinal'));
        if (datos) {
            if (ticketOperacion) ticketOperacion.textContent = datos.nroOperacion;
            if (ticketCliente) ticketCliente.textContent = datos.cliente;
            if (ticketFecha) ticketFecha.textContent = datos.fecha;
            if (ticketTotal) ticketTotal.textContent = `$${datos.total}`;

            ticketProductosBody.innerHTML = "";
            datos.productos.forEach(p => {
                ticketProductosBody.innerHTML += `
                <tr>
                    <td>${p.nombre}</td>
                    <td class="text-center">${p.cantidad} x $${p.precio}</td>
                    <td class="text-end fw-medium">$${p.precio * p.cantidad}</td>
                </tr>`;
            });
        }

        const btnPDF = document.getElementById('btn-descargar-pdf');
        if (btnPDF) {
            btnPDF.addEventListener('click', () => {
                html2pdf().set({
                    margin: 10,
                    filename: `ticket-${datos ? datos.nroOperacion : 'compra'}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                }).from(document.querySelector('.ticket-contenedor')).save();
            });
        }
    }
});