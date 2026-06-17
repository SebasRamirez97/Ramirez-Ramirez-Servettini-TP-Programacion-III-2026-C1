document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. CAPTURA DE ELEMENTOS DEL DOM
    // =========================================================================
    // Elementos de Index (Bienvenida)
    const nombreCliente = document.getElementById('input-nombre');
    const btnComprar = document.getElementById('btn-comprar');

    // Elementos de Categorías (Pantalla Intermedia)
    const btnCatPowerups = document.getElementById('btn-cat-powerups');
    const btnCatVehiculos = document.getElementById('btn-cat-vehiculos');

    // Elementos de Catálogo
    const contenedorProductos = document.getElementById('contenedor-productos');
    const tituloCatalogo = document.getElementById('titulo-catalogo');
    const btnCarrito = document.getElementById('btn-carrito'); 
    
    // Elementos de Carrito
    const tablaCarrito = document.getElementById('tabla-carrito');
    const totalHTML = document.getElementById('total');

    const btnFinalizarCompra = document.getElementById('comprar');
    const btnSeguirComprando = document.getElementById('btn-seguir-comprando');

    // Elementos de Ticket
    const ticketOperacion = document.getElementById('ticket-operacion');
    const ticketCliente = document.getElementById('ticket-cliente');
    const ticketFecha = document.getElementById('ticket-fecha');
    const ticketProductosBody = document.getElementById('ticket-productos-body');
    const ticketTotal = document.getElementById('ticket-total');

    // Elementos Comunes y Navegación
    const btnTema = document.getElementById('btn-tema');      
    const btnVolverInicio = document.getElementById('btn-volver-inicio');
    const btnVolverCategorias = document.getElementById('btn-volver-categorias');
    
    // Estado Global Local
    let articulos = [];
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // =========================================================================
    // 2. SISTEMA DE TEMAS (Claro / Oscuro)
    // =========================================================================
    const temaGuardado = localStorage.getItem('tema');

    if (temaGuardado === 'oscuro') {
        document.body.classList.add('dark-mode');
        if (btnTema) {
            btnTema.textContent = '☀️'; // textContent es seguro
            btnTema.classList.remove('btn-dark');
            btnTema.classList.add('btn-light');
        }
    }

    if (btnTema) {
        btnTema.addEventListener('click', () => {
            const modoOscuroActivo = document.body.classList.toggle('dark-mode');
            if (modoOscuroActivo) {
                btnTema.textContent = '☀️';
                btnTema.classList.remove('btn-dark');
                btnTema.classList.add('btn-light');
                localStorage.setItem('tema', 'oscuro');
            } else {
                btnTema.textContent = '🌙';
                btnTema.classList.remove('btn-light');
                btnTema.classList.add('btn-dark');
                localStorage.setItem('tema', 'claro');
            }
        });
    }

    // =========================================================================
    // 3. CONTROLADORES DE NAVEGACIÓN Y FLUJOS GENERALES
    // =========================================================================
    if (btnCatPowerups) {
        btnCatPowerups.addEventListener('click', () => { location.href = "catalogo.html?categoria=powerups&page=1"; });
    }

    if (btnCatVehiculos) {
        btnCatVehiculos.addEventListener('click', () => { location.href = "catalogo.html?categoria=vehiculos&page=1"; });
    }

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
    // 4. LÓGICA DE PANTALLA: CATÁLOGO (Nodos Seguros)
    // =========================================================================
    if (tituloCatalogo && contenedorProductos) {
        const params = new URLSearchParams(window.location.search);
        const categoria = params.get("categoria") || "powerups";
        const pagina = params.get("page") || "1";

        localStorage.setItem('ultimaCategoria', categoria);

        tituloCatalogo.textContent = categoria === "powerups" ? "Power Ups" : "Vehículos";

        fetch(`http://localhost:3000/api/productos?categoria=${categoria}&page=${pagina}`)
            .then(response => response.json())
            .then(data => {
                articulos = data.productos;
                if (btnCarrito) btnCarrito.classList.remove('d-none');

                renderizarProductosCatálogo(articulos);
                construirControlesPaginacion(data.paginas, parseInt(pagina), categoria);
            })
            .catch(error => console.error("Error conectando con la API del Backend:", error));
    }

    function renderizarProductosCatálogo(listaProductos) {
        contenedorProductos.textContent = ""; // Limpieza segura sin innerHTML
        
        if (listaProductos.length === 0) {
            const pNoProd = document.createElement('p');
            pNoProd.className = "text-center text-muted col-12";
            pNoProd.textContent = "No hay productos disponibles en esta sección.";
            contenedorProductos.appendChild(pNoProd);
            return;
        }

        listaProductos.forEach(producto => {
            const article = document.createElement('article');
            article.classList.add('producto-card');

            let nombreCarpeta;

            if (producto.categoria === 'vehiculos') {
                nombreCarpeta = 'img-vehiculos';
            } else {
                nombreCarpeta = 'img-powerups';
            }
            const urlImagen = `http://localhost:3000/resources/${nombreCarpeta}/${producto.imagen}`;
            const img = document.createElement('img');
            img.src = urlImagen;
            img.classList.add('producto-img');

            const h4 = document.createElement('h4');
            h4.textContent = producto.nombre;

            const pDesc = document.createElement('p');
            pDesc.className = "text-muted small";
            pDesc.textContent = producto.descripcion;

            const pPrecio = document.createElement('p');
            pPrecio.className = "fs-4 fw-bold text-success";
            pPrecio.textContent = `$${producto.precio}`;

            // Contenedor de cantidad
            const selectorCantidad = document.createElement('div');
            selectorCantidad.className = "selector-cantidad";

            const btnMenos = document.createElement('button');
            btnMenos.className = "btn-cantidad menos";
            btnMenos.textContent = "-";

            const spanCant = document.createElement('span');
            spanCant.className = "cantidad-numero fw-bold px-2";
            spanCant.textContent = "1";

            const btnMas = document.createElement('button');
            btnMas.className = "btn-cantidad mas";
            btnMas.textContent = "+";

            selectorCantidad.appendChild(btnMenos);
            selectorCantidad.appendChild(spanCant);
            selectorCantidad.appendChild(btnMas);

            const btnAgregar = document.createElement('button');
            btnAgregar.className = "btn btn-danger w-100 mt-2 btn-agregar";
            btnAgregar.textContent = "Agregar al carrito";

            // Eventos locales nativos
            btnMas.addEventListener('click', () => { spanCant.textContent = parseInt(spanCant.textContent) + 1; });
            btnMenos.addEventListener('click', () => {
                let actual = parseInt(spanCant.textContent);
                if (actual > 1) spanCant.textContent = actual - 1;
            });
            
            btnAgregar.addEventListener('click', () => {
                const cantidadAAgregar = parseInt(spanCant.textContent);
                const itemExistente = carrito.find(item => item.id === producto.id);

                if (itemExistente) {
                    itemExistente.cantidad += cantidadAAgregar;
                } else {
                    carrito.push({
                        id: producto.id,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        cantidad: cantidadAAgregar
                    });
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

            // Ensamblamos la tarjeta de forma segura
            article.appendChild(img);
            article.appendChild(h4);
            article.appendChild(pDesc);
            article.appendChild(pPrecio);
            article.appendChild(selectorCantidad);
            article.appendChild(btnAgregar);

            contenedorProductos.appendChild(article);
        });
    }

    function construirControlesPaginacion(totalPaginas, paginaActual, categoriaActual) {
        let contenedorPaginacion = document.getElementById('paginacion-controles');
        if (!contenedorPaginacion) {
            contenedorPaginacion = document.createElement('div');
            contenedorPaginacion.id = 'paginacion-controles';
            contenedorPaginacion.className = "d-flex justify-content-center gap-2 w-100 mt-4";
            contenedorProductos.parentNode.insertBefore(contenedorPaginacion, contenedorProductos.nextSibling);
        }
        contenedorPaginacion.textContent = "";

        if (totalPaginas <= 1) return;

        for (let i = 1; i <= totalPaginas; i++) {
            const btnPagina = document.createElement('button');
            btnPagina.textContent = i;
            btnPagina.className = `btn ${i === paginaActual ? 'btn-danger' : 'btn-outline-secondary'}`;
            
            btnPagina.addEventListener('click', () => {
                location.href = `catalogo.html?categoria=${categoriaActual}&page=${i}`;
            });
            contenedorPaginacion.appendChild(btnPagina);
        }
    }

    function mostrarGloboFlotante(mensaje) {
    // 1. Estructura: Buscamos o creamos el contenedor con su clase correspondiente
        let contenedor = document.querySelector('.contenedor-carrito-popup');
        if (!contenedor) {
            contenedor = document.createElement('div');
            contenedor.className = 'contenedor-carrito-popup';
            document.body.appendChild(contenedor);
        }

        // 2. Lógica de control: Evitamos duplicados
        const viejo = contenedor.querySelector('.globo-agregado');
        if (viejo) viejo.remove();

        // 3. Estructura: Creamos el globo y le inyectamos el texto seguro
        const globo = document.createElement('div');
        globo.className = 'globo-agregado';
        globo.textContent = mensaje;

        contenedor.appendChild(globo);

        // 4. Lógica de tiempos: Agregamos la clase de salida y luego removemos el nodo
        setTimeout(() => {
            globo.classList.add('oculto'); 
            setTimeout(() => globo.remove(), 400); // Espera a que termine la transición CSS
        }, 2000);
    }

    const botonesNavLateral = document.querySelectorAll('.nav-categoria');
    if (botonesNavLateral.length > 0) {
        botonesNavLateral.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const cat = e.target.getAttribute('data-categoria');
                location.href = `catalogo.html?categoria=${cat}&page=1`;
            });
        });
    }

    // =========================================================================
    // 5. LÓGICA DE PANTALLA: CARRITO (Estructura de Tabla Segura)
    // =========================================================================
    function guardarCarritoYRenderizar() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
    }

    function mostrarCarrito() {
        if (!tablaCarrito || !totalHTML) return;

        tablaCarrito.textContent = ""; // Limpieza limpia sin inyectar string vacío
        let total = 0;

        if (carrito.length === 0) {
            const trVacio = document.createElement('tr');
            const tdVacio = document.createElement('td');
            tdVacio.colSpan = 5;
            tdVacio.className = "text-center text-muted py-4";
            tdVacio.textContent = "El carrito está vacío";
            trVacio.appendChild(tdVacio);
            tablaCarrito.appendChild(trVacio);
            totalHTML.textContent = "0";
            return;
        }

        carrito.forEach((producto, index) => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;

            const tr = document.createElement('tr');

            const tdNombre = document.createElement('td');
            tdNombre.className = "fw-medium";
            tdNombre.textContent = producto.nombre;

            const tdPrecio = document.createElement('td');
            tdPrecio.textContent = `$${producto.precio}`;

            // Celda de controles de cantidad inline
            const tdCantidad = document.createElement('td');
            tdCantidad.className = "text-center";

            const btnRestar = document.createElement('button');
            btnRestar.className = "btn btn-sm btn-dark btn-cantidad-tabla me-2";
            btnRestar.textContent = "-";
            btnRestar.addEventListener('click', () => {
                carrito[index].cantidad--;
                if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
                guardarCarritoYRenderizar();
            });

            const spanCantidad = document.createElement('span');
            spanCantidad.className = "fw-bold";
            spanCantidad.textContent = producto.cantidad;

            const btnSumar = document.createElement('button');
            btnSumar.className = "btn btn-sm btn-dark btn-cantidad-tabla ms-2";
            btnSumar.textContent = "+";
            btnSumar.addEventListener('click', () => {
                carrito[index].cantidad++;
                guardarCarritoYRenderizar();
            });

            tdCantidad.appendChild(btnRestar);
            tdCantidad.appendChild(spanCantidad);
            tdCantidad.appendChild(btnSumar);

            const tdSubtotal = document.createElement('td');
            tdSubtotal.className = "fw-semibold text-success";
            tdSubtotal.textContent = `$${subtotal}`;

            const tdAccion = document.createElement('td');
            tdAccion.className = "text-center";

            const btnEliminar = document.createElement('button');
            btnEliminar.className = "btn btn-sm btn-outline-danger px-3";
            btnEliminar.textContent = "Eliminar";
            btnEliminar.addEventListener('click', () => {
                carrito.splice(index, 1);
                guardarCarritoYRenderizar();
            });
            tdAccion.appendChild(btnEliminar);

            // Montamos la fila de la tabla
            tr.appendChild(tdNombre);
            tr.appendChild(tdPrecio);
            tr.appendChild(tdCantidad);
            tr.appendChild(tdSubtotal);
            tr.appendChild(tdAccion);

            tablaCarrito.appendChild(tr);
        });

        totalHTML.textContent = total;
    }

    if (btnSeguirComprando) {
        btnSeguirComprando.addEventListener('click', () => {
            // Leemos la última categoría visitada. Si no hay ninguna, usamos 'powerups' por defecto.
            const ultimaCat = localStorage.getItem('ultimaCategoria') || 'powerups';
            location.href = `catalogo.html?categoria=${ultimaCat}&page=1`;
        });
    }

    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener("click", () => {
            const modalEl = document.getElementById('modalCarritoAviso');
            const modalMsg = document.getElementById('modalCarritoMensaje');
            const btnCanc = document.getElementById('btnModalCancelar');
            const btnConf = document.getElementById('btnModalConfirmar');
            
            if (!modalEl || !modalMsg) return;
            const bModal = new bootstrap.Modal(modalEl);

            if (carrito.length === 0) {
                modalMsg.textContent = "El carrito está vacío. ¡Agregá artículos antes de confirmar!";
                if (btnCanc) btnCanc.textContent = "Entendido";
                if (btnConf) btnConf.classList.add('d-none'); 
                bModal.show();
                return;
            }

            modalMsg.textContent = "¿Está seguro de que desea confirmar la compra en este autoservicio?";
            if (btnCanc) btnCanc.textContent = "Cancelar";
            if (btnConf) btnConf.classList.remove('d-none');

            btnConf.onclick = () => {
                bModal.hide();
                const nroOperacionAleatorio = Math.floor(1000000000000 + Math.random() * 9000000000000);

                const ticketFinal = {
                    nroOperacion: nroOperacionAleatorio,
                    cliente: localStorage.getItem('nombreCliente') || 'Cliente Anónimo',
                    fecha: new Date().toLocaleString('es-AR'),
                    productos: carrito,
                    total: carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0)
                };

                localStorage.setItem("ticketFinal", JSON.stringify(ticketFinal));
                localStorage.removeItem("carrito"); 
                carrito = [];
                window.location.href = "ticket.html";
            };
            bModal.show();
        });
    }

    if (tablaCarrito) {
        mostrarCarrito();
    }

    // =========================================================================
    // 6. LÓGICA DE PANTALLA: TICKET DINÁMICO
    // =========================================================================
    if (ticketProductosBody) {
        const datosTicket = JSON.parse(localStorage.getItem('ticketFinal'));

        if (datosTicket) {
            if (ticketOperacion) ticketOperacion.textContent = datosTicket.nroOperacion;
            if (ticketCliente) ticketCliente.textContent = datosTicket.cliente;
            if (ticketFecha) ticketFecha.textContent = datosTicket.fecha;
            if (ticketTotal) ticketTotal.textContent = `$${datosTicket.total}`;

            ticketProductosBody.textContent = "";
            datosTicket.productos.forEach(p => {
                const tr = document.createElement('tr');

                const tdNom = document.createElement('td');
                tdNom.textContent = p.nombre;

                const tdDetalle = document.createElement('td');
                tdDetalle.className = "text-center";
                tdDetalle.textContent = `${p.cantidad} x $${p.precio}`;

                const tdSub = document.createElement('td');
                tdSub.className = "text-end fw-medium";
                tdSub.textContent = `$${p.precio * p.cantidad}`;

                tr.appendChild(tdNom);
                tr.appendChild(tdDetalle);
                tr.appendChild(tdSub);
                ticketProductosBody.appendChild(tr);
            });
        }

        const btnDescargarPDF = document.getElementById('btn-descargar-pdf');
        if (btnDescargarPDF) {
            btnDescargarPDF.addEventListener('click', () => {
                const elementoTicket = document.querySelector('.ticket-contenedor');
                
                const opcionesConfig = {
                    margin:       10,
                    filename:     `ticket-${datosTicket ? datosTicket.nroOperacion : 'compra'}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { 
                        scale: 2,             
                        useCORS: true,        
                        backgroundColor: '#ffffff'
                    },
                    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };

                html2pdf().set(opcionesConfig).from(elementoTicket).save();
            });
        }
    }
});