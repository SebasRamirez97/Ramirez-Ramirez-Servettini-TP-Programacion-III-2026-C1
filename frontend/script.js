document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos pantalla Cliente
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
    const btnSeguirComprando = document.getElementById('btn-seguir-comprando');
    const ticketOperacion = document.getElementById('ticket-operacion');
    const ticketCliente = document.getElementById('ticket-cliente');
    const ticketFecha = document.getElementById('ticket-fecha');
    const ticketProductosBody = document.getElementById('ticket-productos-body');
    const ticketTotal = document.getElementById('ticket-total');

    // Elementos Comunes y Navegación
    const btnTema = document.getElementById('btn-tema');      
    const btnVolverInicio = document.getElementById('btn-volver-inicio');
    const btnVolverCategorias = document.getElementById('btn-volver-categorias');
    const btnCerrarSesion =document.getElementById('btn-cerrar-sesion');
    
    // Elementos pantalla Admin
    const emailAdmin = document.getElementById('input-email');
    const contraseñaAdmin = document.getElementById('input-contraseña');
    const btnIngresarAdmin = document.getElementById('btn-ingresar-admin');
    const btnAccesoRapido = document.getElementById('btn-acceso-rapido');
    const formularioProducto = document.querySelector('form'); 
    const inputNombre = document.getElementById('nombre');
    const selectCategoria = document.getElementById('categoria');
    const inputPrecio = document.getElementById('precio');
    const inputImagen = document.getElementById('imagen');
  
    //SISTEMA DE TEMAS (Claro / Oscuro)

    const temaGuardado = localStorage.getItem('tema');

    if (temaGuardado === 'oscuro') {
        document.body.classList.add('dark-mode');
        if (btnTema) {
            btnTema.textContent = '☀️';
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

    // Login Admin
    if (btnIngresarAdmin) {
        btnIngresarAdmin.addEventListener('click',  async ()=> {
            const modalLogin = new bootstrap.Modal(document.getElementById('modalLogin'));
        const modalBody = document.querySelector("#modalLogin .modal-body");

        if (emailAdmin.value.trim() === '') {
            modalBody.textContent = "Por favor ingresá un email para continuar.";
            modalLogin.show();
            return;
        }

        if (contraseñaAdmin.value.trim() === '') {
            modalBody.textContent = "Por favor ingresá una contraseña para continuar.";
            modalLogin.show();
            return;
        }
         try {
            const response = await fetch("http://localhost:3000/api/administradores/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: emailAdmin.value.trim(),
                    password: contraseñaAdmin.value.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                const modal = new bootstrap.Modal(document.getElementById('modalLogin'));
                document.querySelector("#modalLogin .modal-body").textContent = data.error;
                modal.show();
                return;
            }

            localStorage.setItem("adminEmail", data.admin.email);
            location.href = "/api/administradores/dashboard";

        } catch (error) {
            console.error("Error conectando con el backend:", error);
        }
    });
    }

    if (btnAccesoRapido) {
        btnAccesoRapido.addEventListener('click', async function() {
            try {
                const respuesta = await fetch('http://localhost:3000/api/administradores');
                const data = await respuesta.json();

                if (respuesta.ok && data.administradores && data.administradores.length > 0) {

                    let primerAdmin = data.administradores[0]; 
                    emailAdmin.value = primerAdmin.email;
                    contraseñaAdmin.value = '1234567890'; 
                    btnIngresarAdmin.click();

                } else {
                    alert('No se encontraron administradores registrados en el sistema.');
                }

            } catch (error) {
                console.error('Error en el acceso rápido:', error);
                alert('Hubo un problema de conexión al intentar traer el administrador de pruebas.');
            }
        });
    }

     if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', () => {
            location.href = "/api/administradores/login";
        });
    }

    // Catalogo

    let articulos = [];
    
    async function cargarCatalogo() {

        const params = new URLSearchParams(window.location.search);
        const categoria = params.get("categoria") || "powerups";
        const pagina = params.get("page") || "1";

        localStorage.setItem('ultimaCategoria', categoria);

        if(categoria === "powerups"){
            tituloCatalogo.textContent = "Power Up";
        }else{
            tituloCatalogo.textContent = "Vehículo";
        }

        try{
            const urlBuscada = `http://localhost:3000/api/productos?categoria=${categoria}&page=${pagina}`;
            const respuestaServidor = await fetch(urlBuscada);
            const data = await respuestaServidor.json();
            articulos = data.productos;

            if(btnCarrito){
                btnCarrito.classList.remove('d-none');
            }
            renderizarProductosCatálogo(articulos);
            construirControlesPaginacion(data.paginas, parseInt(pagina),categoria);
        }catch(error){
            console.error("Error conectando con la API del Backend:", error);
        }
        
    }

    function renderizarProductosCatálogo(listaProductos) {
        contenedorProductos.textContent = "";
        
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

            const nombreCarpeta = 'img-productos';

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
                notificacionAgregadoCarrito(`+${cantidadAAgregar} ${producto.nombre} agregado`);

                btnAgregar.textContent = '¡Agregado!';
                btnAgregar.classList.replace('btn-danger', 'btn-success');
                setTimeout(() => {
                    btnAgregar.textContent = 'Agregar al carrito';
                    btnAgregar.classList.replace('btn-success', 'btn-danger');
                    spanCant.textContent = '1';
                }, 1000);
            });

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

    function notificacionAgregadoCarrito(mensaje) {
        let contenedor = document.querySelector('.contenedor-carrito-popup');
        if (!contenedor) {
            contenedor = document.createElement('div');
            contenedor.className = 'contenedor-carrito-popup';
            document.body.appendChild(contenedor);
        }

        const viejo = contenedor.querySelector('.globo-agregado');
        if (viejo) viejo.remove();

        const globo = document.createElement('div');
        globo.className = 'globo-agregado';
        globo.textContent = mensaje;

        contenedor.appendChild(globo);

        setTimeout(() => {
            globo.classList.add('oculto'); 
            setTimeout(() => globo.remove(), 400);
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

    // Carrito

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function guardarCarritoYRenderizar() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
    }

    function mostrarCarrito() {
        if (!tablaCarrito || !totalHTML) return;

        tablaCarrito.textContent = "";
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
            const ultimaCat = localStorage.getItem('ultimaCategoria') || 'powerups';
            location.href = `catalogo.html?categoria=${ultimaCat}&page=1`;
        });
    }

    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener("click", () => {
            const modalCarrito = document.getElementById('modalCarritoAviso');
            const modalMsg = document.getElementById('modalCarritoMensaje');
            const btnCanc = document.getElementById('btnModalCancelar');
            const btnConf = document.getElementById('btnModalConfirmar');
            
            if (!modalCarrito || !modalMsg) return;
            const bModal = new bootstrap.Modal(modalCarrito);

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

            btnConf.onclick = async () => {
                bModal.hide();

                let sumaTotal = 0;

                for (let i = 0; i < carrito.length; i++) {
                    let productoActual = carrito[i];
                    let subtotal = productoActual.precio * productoActual.cantidad;
                    
                    sumaTotal = sumaTotal + subtotal;
                }

                const productosComprados = [];
                carrito.forEach((producto)=>{
                    productosComprados.push({
                        id: producto.id ,
                        cantidad : producto.cantidad
                    });
                });

                const datosVenta = {
                    nombre_cliente : localStorage.getItem('nombreCliente'),
                    precio_total : sumaTotal,
                    productos : productosComprados

                };
                try{
                const respuesta = await fetch('http://localhost:3000/api/ventas/crear',{
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify(datosVenta)
                });

                const ventaCreada = await respuesta.json();
                console.log('Venta registrada:', ventaCreada)

                const ticketFinal = {
                    nroOperacion : ventaCreada.id,
                    cliente: datosVenta.nombre_cliente || 'Cliente Anónimo',
                    fecha: new Date().toLocaleString('es-AR'),
                    productos: carrito,
                    total: sumaTotal
                };

                localStorage.setItem("ticketFinal", JSON.stringify(ticketFinal));
                localStorage.removeItem("carrito"); 
                carrito = [];
                window.location.href = "ticket.html";
                } catch (err) {
                    console.error("Error al procesar la venta:", err);
                    alert("No se pudo guardar la venta en la base de datos.");
                }
            };
            bModal.show();
        });
    }

    // Ticket
    if (ticketProductosBody) {
        const datosTicketLocal = JSON.parse(localStorage.getItem('ticketFinal'));
        if (datosTicketLocal) {
            if (ticketOperacion) ticketOperacion.textContent = datosTicketLocal.nroOperacion;
            if (ticketCliente) ticketCliente.textContent = datosTicketLocal.cliente;
            if (ticketFecha) ticketFecha.textContent = datosTicketLocal.fecha;
            if (ticketTotal) ticketTotal.textContent = `$${datosTicketLocal.total}`;

            ticketProductosBody.textContent = "";
            datosTicketLocal.productos.forEach(p => {
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
                    filename:     `ticket-${datosTicketLocal ? datosTicketLocal.nroOperacion : 'compra'}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { 
                        scale: 2,             
                        useCORS: true,        
                        backgroundColor: '#ffffff',
                        scrollY: 0
                    },
                    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
                    pagebreak:    { mode: 'avoid-all' }
                };

                html2pdf().set(opcionesConfig).from(elementoTicket).save();
            });
        }
    }

    // Dashboard
    if (window.location.pathname.includes('/administradores/dashboard')) {
        configurarBotonesDashboardEJS();
    }

    function configurarBotonesDashboardEJS() {
        
        const botonesEstado = document.querySelectorAll('.btn-cambiar-estado');
        botonesEstado.forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const activo = btn.getAttribute('data-activo') === 'true';

                try {
                    const respuesta = await fetch(`http://localhost:3000/api/productos/${id}/estado`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ activo: !activo })
                    });

                    if (respuesta.ok) {
                        window.location.reload();
                    } else {
                        alert("Error al cambiar el estado en el servidor.");
                    }
                } catch (error) {
                    console.error("Error cambiando estado:", error);
                }
            });
        });

        const botonesEditar = document.querySelectorAll('.btn-editar-inline');
        botonesEditar.forEach(btn => {
            
            let archivoSeleccionado = null;
            let imagenEliminada = false;

            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const fila = document.querySelector(`tr[data-id="${id}"]`);
                if (!fila) return;

                const celdaImg = fila.querySelector('.celda-img');
                const imgElement = celdaImg.querySelector('img');
                const celdaNombre = fila.querySelector('.celda-nombre');
                const celdaPrecio = fila.querySelector('.celda-precio');

                // Modo editar
                if (btn.textContent.trim() === 'Editar') {
                    btn.textContent = 'Guardar';
                    btn.className = 'btn btn-sm btn-success ms-2';

                    const nombreActual = celdaNombre.textContent.trim();
                    const precioActual = celdaPrecio.textContent.trim().replace('$', '');

                    celdaNombre.innerHTML = `<input type="text" class="form-control form-control-sm" value="${nombreActual}">`;
                    celdaPrecio.innerHTML = `<input type="number" class="form-control form-control-sm" value="${precioActual}">`;

                    const contenedorControlesImg = document.createElement("div");
                    contenedorControlesImg.className = "d-inline-flex flex-column gap-1 align-items-center ms-2";
                    contenedorControlesImg.style.verticalAlign = "middle";

                    const btnSubirImg = document.createElement("button");
                    btnSubirImg.type = "button";
                    btnSubirImg.className = "btn btn-xs btn-outline-primary p-0 d-flex align-items-center justify-content-center";
                    btnSubirImg.style.width = "22px";
                    btnSubirImg.style.height = "22px";
                    btnSubirImg.textContent = "⬆️";

                    const btnBorrarImg = document.createElement("button");
                    btnBorrarImg.type = "button";
                    btnBorrarImg.className = "btn btn-xs btn-outline-danger p-0 d-flex align-items-center justify-content-center";
                    btnBorrarImg.style.width = "22px";
                    btnBorrarImg.style.height = "22px";
                    btnBorrarImg.textContent = "🗑️";

                    const inputOcultoFile = document.createElement("input");
                    inputOcultoFile.type = "file";
                    inputOcultoFile.accept = "image/*";
                    inputOcultoFile.style.display = "none";

                    btnSubirImg.addEventListener("click", () => inputOcultoFile.click());

                    inputOcultoFile.addEventListener("change", () => {
                        if (inputOcultoFile.files.length > 0) {
                            archivoSeleccionado = inputOcultoFile.files[0];
                            imagenEliminada = false;
                            imgElement.src = URL.createObjectURL(archivoSeleccionado);
                        }
                    });

                    btnBorrarImg.addEventListener("click", () => {
                        archivoSeleccionado = null;
                        imagenEliminada = true;
                        inputOcultoFile.value = "";
                        imgElement.src = "/img-productos/default.png";
                    });

                    contenedorControlesImg.appendChild(btnSubirImg);
                    contenedorControlesImg.appendChild(btnBorrarImg);
                    contenedorControlesImg.appendChild(inputOcultoFile);

                    const contenedorFlexFoto = celdaImg.querySelector('.d-flex') || celdaImg;
                    contenedorFlexFoto.appendChild(contenedorControlesImg);

                } else {

                    const nuevoNombre = celdaNombre.querySelector('input').value.trim();
                    const nuevoPrecio = celdaPrecio.querySelector('input').value.trim();

                    if (nuevoNombre === "" || nuevoPrecio === "") {
                        alert("Por favor, completá todos los campos obligatorios.");
                        return;
                    }

                    const valijaEdicion = new FormData();
                    valijaEdicion.append("nombre", nuevoNombre);
                    valijaEdicion.append("precio", nuevoPrecio);

                    if (archivoSeleccionado) {
                        valijaEdicion.append("imagen", archivoSeleccionado);
                    } else if (imagenEliminada) {
                        valijaEdicion.append("imagen", "default.png");
                    }

                    try {
                        const respuesta = await fetch(`http://localhost:3000/api/productos/editar/${id}`, {
                            method: "PATCH",
                            body: valijaEdicion
                        });

                        if (respuesta.ok) {
                            alert("¡Producto modificado con éxito!");
                            window.location.reload();
                        } else {
                            alert("Hubo un problema al intentar guardar las modificaciones.");
                        }
                    } catch (error) {
                        console.error("Error guardando edición inline:", error);
                    }
                }
            });
        });
    }

    // Crear Productos

    function configurarFormularioProducto() {

        const formulario = document.querySelector('form');
        
        if (!formulario) {
            return; 
        }

        formulario.addEventListener('submit', async function(evento) {
            
            evento.preventDefault(); 

            const productoNuevo = new FormData();

            productoNuevo.append('nombre', inputNombre.value.trim());
            productoNuevo.append('categoria', selectCategoria.value);
            productoNuevo.append('precio', inputPrecio.value);

            if (inputImagen.files.length > 0) {
                productoNuevo.append('imagen', inputImagen.files[0]);
            }
            try {
                const respuesta = await fetch('http://localhost:3000/api/productos/crear', {
                    method: 'POST',
                    body: productoNuevo 
                });

                if (respuesta.ok) {
                    alert('¡Producto guardado con éxito en el sistema!');
                    window.location.href = '/api/administradores/dashboard';
                } else {
                    alert('El servidor rechazó el producto. Verificá los campos.');
                }

            } catch (error) {
                console.error('Error de conexión:', error);
                alert('No se pudo conectar con el servidor. ¿Está el backend prendido?');
            }
        });
    }

    // Exportar Historial de Ventas a Excel
    const btnExportarExcel = document.getElementById('btn-exportar-excel');

    if (btnExportarExcel) {
        btnExportarExcel.addEventListener('click', () => {
            const tabla = document.getElementById('tabla-ventas');
            
            if (!tabla) {
                alert('No se encontró la tabla de ventas para exportar.');
                return;
            }

            // 1. Convertir la tabla HTML en una hoja de trabajo (worksheet) de Excel
            const hojaTrabajo = XLSX.utils.table_to_sheet(tabla);

            /* Opcional: Si tu tabla tiene una columna de "Acciones" (con botones), 
            Excel la va a exportar con textos raros. Si querés borrar, por ejemplo, 
            la columna 6 antes de exportar, podés investigar "delete_cols", 
            pero para empezar, esto te exporta todo el texto limpio.
            */

            // 2. Crear un libro de trabajo (workbook) vacío
            const libroTrabajo = XLSX.utils.book_new();

            // 3. Añadir la hoja de ventas al libro con el nombre "Historial"
            XLSX.utils.book_append_sheet(libroTrabajo, hojaTrabajo, "Historial Ventas");

            // 4. Generar el archivo y disparar la descarga automática
            const fechaActual = new Date().toISOString().slice(0, 10); // Formato AAAA-MM-DD
            XLSX.writeFile(libroTrabajo, `Reporte_Ventas_${fechaActual}.xlsx`);
        });
    }

    // ==========================================================================
    // SISTEMA DE AUDIO (Música de fondo)
    // ==========================================================================
    const musica = document.getElementById('musica-fondo');
    const btnMusica = document.getElementById('btn-musica');
    const barraVolumen = document.getElementById('barra-volumen');

    if (musica && btnMusica && barraVolumen) {
        // 1. Forzar el volumen inicial al 50%
        musica.volume = 0.5;

        // ⚠️ POLÍTICA DE NAVEGADORES: Google Chrome y Firefox bloquean el autoplay de audio.
        // La música NO puede arrancar sola hasta que el usuario haga click en CUALQUIER lado de la pantalla.
        document.addEventListener('click', () => {
            if (musica.paused && !musica.dataset.comenzada) {
                musica.play().catch(err => console.log("Autoplay bloqueado temporalmente por el navegador."));
                musica.dataset.comenzada = true;
                btnMusica.textContent = '🔊';
            }
        }, { once: true }); // 'once: true' hace que este detector se destruya al primer click

        // 2. Evento del botón (Play / Pausa)
        btnMusica.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que se dispare el click global de arriba
            
            if (musica.paused) {
                musica.play();
                btnMusica.textContent = '🔊';
            } else {
                musica.pause();
                btnMusica.textContent = '🔈';
            }
        });

        // 3. Evento de la barra de volumen
        barraVolumen.addEventListener('input', () => {
            musica.volume = barraVolumen.value;

            // Cambiar dinámicamente el emoji según el nivel de volumen
            if (parseFloat(musica.volume) === 0) {
                btnMusica.textContent = '❌'; // Silenciado
            } else if (musica.volume < 0.4) {
                btnMusica.textContent = '🔈'; // Volumen bajo
            } else {
                btnMusica.textContent = '🔊'; // Volumen alto
            }

            // Si suben el volumen estando pausado, que se le dé play automático
            if (musica.paused && musica.volume > 0) {
                musica.play();
            }
        });
    }

    if (contenedorProductos) {
        cargarCatalogo();
    }

    if (tablaCarrito) {
        mostrarCarrito();
    }

    if (window.location.pathname.includes('dashboard.html')) {
        cargarDashboard(1);
    }

    const formularioExiste = document.querySelector('form');
    if (formularioExiste) {
        configurarFormularioProducto();
    }
});