document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. CAPTURA DE ELEMENTOS DEL DOM (Todas las pantallas unificadas)
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
    // 2. SISTEMA DE TEMAS (Claro / Oscuro) - Con íconos de Sol y Luna
    // =========================================================================
    const temaGuardado = localStorage.getItem('tema');

    // Si el usuario tenía el modo oscuro guardado al cargar la página
    if (temaGuardado === 'oscuro') {
        document.body.classList.add('dark-mode');
        if (btnTema) {
            btnTema.innerHTML = '☀️'; // Muestra el Sol (para volver al modo claro)
            btnTema.classList.remove('btn-dark');
            btnTema.classList.add('btn-light');
        }
    }

    // Evento de clic para alternar entre Sol y Luna
    if (btnTema) {
        btnTema.addEventListener('click', () => {
            const modoOscuroActivo = document.body.classList.toggle('dark-mode');

            if (modoOscuroActivo) {
                btnTema.innerHTML = '☀️'; // Si se oscureció, el botón muestra el Sol
                btnTema.classList.remove('btn-dark');
                btnTema.classList.add('btn-light');
                localStorage.setItem('tema', 'oscuro');
            } else {
                btnTema.innerHTML = '🌙'; // Si se aclaró, el botón muestra la Luna
                btnTema.classList.remove('btn-light');
                btnTema.classList.add('btn-dark');
                localStorage.setItem('tema', 'claro');
            }
        });
    }

    // =========================================================================
    // 3. CONTROLADORES DE LA PANTALLA: CATEGORIAS.HTML
    // =========================================================================
    if (btnCatPowerups) {
        btnCatPowerups.addEventListener('click', () => {
            location.href = "catalogo.html?categoria=powerups";
        });
    }

    if (btnCatVehiculos) {
        btnCatVehiculos.addEventListener('click', () => {
            location.href = "catalogo.html?categoria=vehiculos";
        });
    }

    // =========================================================================
    // 4. NAVEGACIÓN GENERAL Y VALIDACIONES DE FLUJO
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
            // Al regresar al inicio desde cualquier pantalla limpiamos los datos de sesión del cliente [cite: 90, 142]
            localStorage.removeItem('nombreCliente');
            localStorage.removeItem('ticketFinal');
            location.href = "index.html";
        });
    }

    if (btnVolverCategorias) {
        btnVolverCategorias.addEventListener('click', () => {
            location.href = "categorias.html";
        });
    }
    if(btnCarrito){
        btnCarrito.addEventListener('click', () => {
            location.href = "carrito.html";
        })
    }


    if (btnCarrito) {
        btnCarrito.addEventListener('click', () => {
            location.href = "carrito.html";
        });
    }

    // =========================================================================
    // 5. LÓGICA DE PANTALLA: CATÁLOGO (Fetch y Menú Lateral)
    // =========================================================================
    if (tituloCatalogo && contenedorProductos) {
        fetch('./articulos.json')
            .then(response => response.json())
            .then(data => {
                articulos = data;
                console.log("¡JSON cargado correctamente!", articulos);

                if (btnCarrito) btnCarrito.classList.remove('d-none');

                const params = new URLSearchParams(window.location.search);
                const categoria = params.get("categoria");
                if (categoria) {
                    const titulo = categoria === "powerups" ? "Power Ups" : "Vehículos";
                    mostrarCategoria(categoria, titulo);
                }
            })
            .catch(error => console.error("Error cargando el archivo JSON:", error));
    }

    function mostrarCategoria(categoriaFiltro, textoTitulo) {
        tituloCatalogo.textContent = textoTitulo;
        contenedorProductos.innerHTML = "";
        
        // Renderizamos solo los productos de la categoría seleccionada que estén activos [cite: 127]
        const productosFiltrados = articulos.filter(item => item.categoria === categoriaFiltro && item.activo !== false);

        productosFiltrados.forEach(producto => {
            const article = document.createElement('article');
            article.classList.add('producto-card');
    
            const img = document.createElement('img');
            img.src = producto.imagen || "https://via.placeholder.com/200x150?text=Sin+Imagen";          
            img.alt = producto.nombre;             
            img.classList.add('producto-img');
            article.appendChild(img);               
            
            const h4 = document.createElement('h4');
            h4.textContent = producto.nombre;       
            article.appendChild(h4);
            
            const pDesc = document.createElement('p');
            pDesc.textContent = producto.descripcion;
            pDesc.classList.add('text-muted', 'small');
            article.appendChild(pDesc);
            
            const pPrecio = document.createElement('p');
            pPrecio.textContent = `$${producto.precio}`;
            pPrecio.classList.add('fs-4', 'fw-bold', 'text-success');
            article.appendChild(pPrecio);
            
            // Selector de Cantidades por Tarjeta [cite: 58, 134]
            const selectorCantidad = document.createElement('div');
            selectorCantidad.classList.add('selector-cantidad');
            
            const btnMenos = document.createElement('button');
            btnMenos.textContent = '-';
            btnMenos.classList.add('btn-cantidad');
            selectorCantidad.appendChild(btnMenos);
            
            const spanCantidad = document.createElement('span');
            spanCantidad.textContent = '1'; 
            spanCantidad.classList.add('cantidad-numero', 'fw-bold', 'px-2');
            selectorCantidad.appendChild(spanCantidad);
            
            const btnMas = document.createElement('button');
            btnMas.textContent = '+';
            btnMas.classList.add('btn-cantidad');
            selectorCantidad.appendChild(btnMas);
            
            article.appendChild(selectorCantidad);

            btnMas.addEventListener('click', () => {
                spanCantidad.textContent = parseInt(spanCantidad.textContent) + 1;
            });

            btnMenos.addEventListener('click', () => {
                let actual = parseInt(spanCantidad.textContent);
                if (actual > 1) spanCantidad.textContent = actual - 1;
            });
            
            const btnAgregar = document.createElement('button');
            btnAgregar.textContent = 'Agregar al carrito';
            btnAgregar.classList.add('btn', 'btn-danger', 'w-100', 'mt-2');
            article.appendChild(btnAgregar);

            // Guardado acumulativo en LocalStorage [cite: 58]
            btnAgregar.addEventListener('click', () => {
                const cantidadAAgregar = parseInt(spanCantidad.textContent);
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
                
                btnAgregar.textContent = '¡Agregado!';
                btnAgregar.classList.replace('btn-danger', 'btn-success');
                setTimeout(() => {
                    btnAgregar.textContent = 'Agregar al carrito';
                    btnAgregar.classList.replace('btn-success', 'btn-danger');
                    spanCantidad.textContent = '1';
                }, 1000);
            });

            contenedorProductos.appendChild(article);
        });
    }

    // Controladores de los botones de navegación lateral en catálogo [cite: 42-43]
    const botonesNavLateral = document.querySelectorAll('.nav-categoria');
    if (botonesNavLateral.length > 0) {
        botonesNavLateral.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const cat = e.target.getAttribute('data-categoria');
                location.href = `catalogo.html?categoria=${cat}`;
            });
        });
    }

    // =========================================================================
    // 6. LÓGICA DE PANTALLA: CARRITO (Operaciones integradas de la tabla)
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

        carrito.forEach((producto, index) => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;

            tablaCarrito.innerHTML += `
            <tr>
                <td class="fw-medium">${producto.nombre}</td>
                <td>$${producto.precio}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-secondary btn-cantidad-tabla me-2" onclick="restarCantidad(${index})">-</button>
                    <span class="fw-bold">${producto.cantidad}</span>
                    <button class="btn btn-sm btn-secondary btn-cantidad-tabla ms-2" onclick="sumarCantidad(${index})">+</button>
                </td>
                <td class="fw-semibold text-success">$${subtotal}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${index})">Eliminar</button>
                </td>
            </tr>`;
        });

        totalHTML.textContent = total;
    }

    // Exposición de funciones al entorno global para los clics en la tabla inline [cite: 59, 133]
    window.sumarCantidad = function(index) {
        carrito[index].cantidad++;
        guardarCarritoYRenderizar();
    };

    window.restarCantidad = function(index) {
        carrito[index].cantidad--;
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        guardarCarritoYRenderizar();
    };

    window.eliminarProducto = function(index) {
        carrito.splice(index, 1);
        guardarCarritoYRenderizar();
    };

    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener("click", () => {
            if (carrito.length === 0) {
                alert("El carrito está vacío");
                return;
            }

            // Modal de confirmación exigido por pauta de evaluación [cite: 140]
            const confirmar = confirm("¿Está seguro de que desea confirmar la compra en este autoservicio?");
            if (!confirmar) return;

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
        });
    }

    if (tablaCarrito) {
        mostrarCarrito();
    }

    // =========================================================================
    // 7. LÓGICA DE PANTALLA: TICKET DINÁMICO
    // =========================================================================
    if (ticketProductosBody) {
        const datosTicket = JSON.parse(localStorage.getItem('ticketFinal'));

        if (datosTicket) {
            if (ticketOperacion) ticketOperacion.textContent = datosTicket.nroOperacion;
            if (ticketCliente) ticketCliente.textContent = datosTicket.cliente;
            if (ticketFecha) ticketFecha.textContent = datosTicket.fecha;
            if (ticketTotal) ticketTotal.textContent = `$${datosTicket.total}`;

            ticketProductosBody.innerHTML = "";
            datosTicket.productos.forEach(p => {
                const sub = p.precio * p.cantidad;
                ticketProductosBody.innerHTML += `
                <tr>
                    <td>${p.nombre}</td>
                    <td class="text-center">${p.cantidad} x $${p.precio}</td>
                    <td class="text-end fw-medium">$${sub}</td>
                </tr>`;
            });
        }

        // --- Descarga de PDF espejo SIN CORTES ---
        const btnDescargarPDF = document.getElementById('btn-descargar-pdf');
        if (btnDescargarPDF) {
            btnDescargarPDF.addEventListener('click', () => {
                const elementoTicket = document.querySelector('.ticket-contenedor');
                
                const opcionesConfig = {
                    margin:       10,
                    filename:     `ticket-${datosTicket ? datosTicket.nroOperacion : 'compra'}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { 
                        scale: 2,             // Alta resolución para textos claros
                        useCORS: true,        
                        backgroundColor: '#ffffff',
                        // SCROLL FIX: Estas dos líneas solucionan el corte del PDF de raíz
                        scrollX: 0,
                        scrollY: 0
                    },
                    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
                    // Evita que las filas de la tabla se rompan de forma extraña entre páginas
                    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
                };

                // Ejecuta la conversión limpia
                html2pdf().set(opcionesConfig).from(elementoTicket).save();
            });
        }
    
    }
});