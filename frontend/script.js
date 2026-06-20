document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. CAPTURA DE ELEMENTOS DEL DOM
    // =========================================================================
    // Elementos de Index (Bienvenida)
    const nombreCliente = document.getElementById('input-nombre');
    const btnComprar = document.getElementById('btn-comprar');

    // Elementos de loginAdmin (Bienvenida)
    const emailAdmin = document.getElementById('input-email');
    const contraseñaAdmin = document.getElementById('input-contraseña');
    const btnIngresarAdmin = document.getElementById('btn-ingresar-admin');
    const btnAccesoRapido = document.getElementById('btn-acceso-rapido');

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
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    
    // Elementos input
    const inputNombre = document.getElementById('nombre');
    const selectCategoria = document.getElementById('categoria');
    const inputPrecio = document.getElementById('precio');
    const inputImagen = document.getElementById('imagen');
  
    // =========================================================================
    // 2. SISTEMA DE TEMAS (Claro / Oscuro)
    // =========================================================================
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
    // 3.1 CONTROLADORES DE NAVEGACIÓN ADMIN CONSOLE
    // =========================================================================
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
                location.href = "dashboard.html";

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
            location.href = "loginAdmin.html";
        });
    }

    // =========================================================================
    // 4. LÓGICA DE PANTALLA: CATÁLOGO
    // =========================================================================
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
            construirControlesPaginacion(data.paginas, parseInt(pagina), categoria);
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

            const urlImagen = `http://localhost:3000/resources/img-productos/${producto.imagen}`;
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
                        character: producto.imagen, // Guarda imagen de referencia si hace falta
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

    // =========================================================================
    // 4.5 LÓGICA DE PANTALLA: DASHBOARD
    // =========================================================================
    async function cargarDashboard(pagina = 1) {
        try {
            const urlBuscada = `http://localhost:3000/api/productos?page=${pagina}&admin=true`;
            const respuestaServidor = await fetch(urlBuscada);
            const data = await respuestaServidor.json();

            renderizarDashboard(data.productos, data.paginaActual);
            construirControlesPaginacionDashboard(data.paginas, data.paginaActual);
        } catch (error) {
            console.error("Error conectando con la API del Dashboard:", error);
        }
    }

    function renderizarDashboard(listaProductos, paginaActual) {
        const tabla = document.getElementById("tabla-dashboard-productos") || document.querySelector("tbody");
        if (!tabla) return;
        
        tabla.textContent = ""; 

        listaProductos.forEach(function(prod) {
            let editando = false; 
            let archivoSeleccionado = null; 
            let imagenEliminada = false;    

            const fila = document.createElement("tr");

            const tdId = document.createElement("td");
            tdId.textContent = prod.id;

            const tdImg = document.createElement("td");
            const img = document.createElement("img");
            img.src = `http://localhost:3000/resources/img-productos/${prod.imagen}`;
            img.style.width = "60px";
            img.style.height = "60px";
            img.style.objectFit = "contain";
            tdImg.appendChild(img);

            const tdNombre = document.createElement("td");
            tdNombre.textContent = prod.nombre;

            const tdCat = document.createElement("td");
            tdCat.textContent = prod.categoria;

            const tdPrecio = document.createElement("td");
            tdPrecio.textContent = `$${prod.precio}`;

            const tdEstado = document.createElement("td");
            tdEstado.textContent = prod.activo ? "Activo" : "Inactivo";

            const tdAcciones = document.createElement("td");
            tdAcciones.className = "text-center";

            const btnEstado = document.createElement("button");
            btnEstado.className = `btn btn-sm ${prod.activo ? "btn-warning" : "btn-success"}`;
            btnEstado.textContent = prod.activo ? "Desactivar" : "Activar";
            
            btnEstado.addEventListener("click", async function() {
                try {
                    const respuesta = await fetch(`http://localhost:3000/api/productos/${prod.id}/estado`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ activo: !prod.activo })
                    });
                    if (respuesta.ok) {
                        cargarDashboard(paginaActual);
                    }
                } catch (error) {
                    console.error("Error al cambiar estado:", error);
                }
            });

            const btnEditar = document.createElement("button");
            btnEditar.className = "btn btn-sm btn-primary ms-2";
            btnEditar.textContent = "Editar";

            btnEditar.addEventListener("click", async function() {
                if (!editando) {
                    editando = true;
                    btnEditar.textContent = "Guardar";
                    btnEditar.className = "btn btn-sm btn-success ms-2";
                    btnEstado.disabled = true; 

                    const inputNombreForm = document.createElement("input");
                    inputNombreForm.type = "text";
                    inputNombreForm.className = "form-control form-control-sm";
                    inputNombreForm.value = prod.nombre;
                    tdNombre.textContent = ""; 
                    tdNombre.appendChild(inputNombreForm);

                    const inputPrecioForm = document.createElement("input");
                    inputPrecioForm.type = "number";
                    inputPrecioForm.className = "form-control form-control-sm";
                    inputPrecioForm.value = prod.precio;
                    tdPrecio.textContent = "";
                    tdPrecio.appendChild(inputPrecioForm);

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

                    btnSubirImg.addEventListener("click", function() {
                        inputOcultoFile.click();
                    });

                    inputOcultoFile.addEventListener("change", function() {
                        if (inputOcultoFile.files.length > 0) {
                            archivoSeleccionado = inputOcultoFile.files[0];
                            imagenEliminada = false;
                            img.src = URL.createObjectURL(archivoSeleccionado); 
                        }
                    });

                    btnBorrarImg.addEventListener("click", function() {
                        archivoSeleccionado = null;
                        imagenEliminada = true;
                        inputOcultoFile.value = ""; 
                        img.src = "http://localhost:3000/resources/img-productos/default.png"; 
                    });

                    contenedorControlesImg.appendChild(btnSubirImg);
                    contenedorControlesImg.appendChild(btnBorrarImg);
                    contenedorControlesImg.appendChild(inputOcultoFile);
                    tdImg.appendChild(contenedorControlesImg);

                    const btnCancelar = document.createElement("button");
                    btnCancelar.className = "btn btn-sm btn-secondary ms-1";
                    btnCancelar.textContent = "X";
                    btnCancelar.addEventListener("click", function() {
                        cargarDashboard(paginaActual); 
                    });
                    tdAcciones.appendChild(btnCancelar);

                } else {
                    const valorNombre = tdNombre.querySelector("input").value.trim();
                    const valorPrecio = tdPrecio.querySelector("input").value;

                    if (valorNombre === "" || valorPrecio === "") {
                        alert("Por favor, completá todos los campos antes de guardar.");
                        return;
                    }

                    const valijaEdicion = new FormData();
                    valijaEdicion.append("nombre", valorNombre);
                    valijaEdicion.append("precio", valorPrecio);

                    if (archivoSeleccionado) {
                        valijaEdicion.append("imagen", archivoSeleccionado); 
                    } else if (imagenEliminada) {
                        valijaEdicion.append("imagen", "default.png"); 
                    }

                    try {
                        const respuesta = await fetch(`http://localhost:3000/api/productos/editar/${prod.id}`, {
                            method: "PATCH",
                            body: valijaEdicion
                        });

                        if (respuesta.ok) {
                            alert("¡Producto modificado con éxito!");
                            cargarDashboard(paginaActual); 
                        } else {
                            alert("Hubo un problema al intentar guardar las modificaciones.");
                        }
                    } catch (error) {
                        console.error("Error conectando con el backend en la edición:", error);
                        alert("No se pudo conectar con el servidor.");
                    }
                }
            });

            tdAcciones.appendChild(btnEstado);
            tdAcciones.appendChild(btnEditar);

            fila.appendChild(tdId);
            fila.appendChild(tdImg);
            fila.appendChild(tdNombre);
            fila.appendChild(tdCat);
            fila.appendChild(tdPrecio);
            fila.appendChild(tdEstado);
            fila.appendChild(tdAcciones);

            tabla.appendChild(fila);
        });
    }

    function construirControlesPaginacionDashboard(totalPaginas, paginaActual) {
        let contenedorPaginacion = document.getElementById('paginacion-controles');
        if (!contenedorPaginacion) {
            contenedorPaginacion = document.createElement('div');
            contenedorPaginacion.id = 'paginacion-controles';
            contenedorPaginacion.className = "d-flex justify-content-center gap-2 w-100 mt-4";
            document.querySelector("main").appendChild(contenedorPaginacion);
        }
        contenedorPaginacion.textContent = "";

        if (totalPaginas <= 1) return;

        for (let i = 1; i <= totalPaginas; i++) {
            const btnPagina = document.createElement('button');
            btnPagina.textContent = i;
            btnPagina.className = `btn ${i === paginaActual ? 'btn-danger' : 'btn-outline-secondary'}`;
        
            btnPagina.addEventListener('click', () => {
                cargarDashboard(i); 
            });
            contenedorPaginacion.appendChild(btnPagina);
        }
    }

    // =========================================================================
    // 5. LÓGICA DE PANTALLA: CARRITO
    // =========================================================================
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
                    sumaTotal += (carrito[i].precio * carrito[i].cantidad);
                }

                const productosComprados = [];
                carrito.forEach((producto)=>{
                    productosComprados.push({
                        id: producto.id,
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

    // =========================================================================
    // 6. LÓGICA DE PANTALLA: TICKET DINÁMICO
    // =========================================================================
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

    // =========================================================================
    // 7. LÓGICA PARA CREAR PRODUCTOS
    // =========================================================================
    function configurarFormularioProducto() {
        const formulario = document.querySelector('form');
        if (!formulario) return; 

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
                    window.location.href = 'dashboard.html';
                } else {
                    alert('El servidor rechazó el producto. Verificá los campos.');
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                alert('No se pudo conectar con el servidor. ¿Está el backend prendido?');
            }
        });
    }

    // =========================================================================
    // 8. LÓGICA DE PANTALLA: HISTORIAL DE VENTAS (ventas.html)
    // =========================================================================
    async function cargarHistorialVentas() {
        const tbody = document.getElementById('tabla-ventas-body');
        if (!tbody) return;

        try {
            const urlVentas = 'http://localhost:3000/api/ventas';
            const respuesta = await fetch(urlVentas);
            
            if (!respuesta.ok) {
                throw new Error(`Error del servidor: ${respuesta.status}`);
            }

            const ventas = await respuesta.json();
            tbody.textContent = ""; 

            if (!ventas || ventas.length === 0) {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td colspan="5" class="text-center text-muted py-4">No hay ventas registradas en el sistema.</td>`;
                tbody.appendChild(tr);
                return;
            }

            ventas.forEach(venta => {
                const fila = document.createElement('tr');

                const tdFactura = document.createElement('td');
                tdFactura.textContent = `#${String(venta.id).padStart(6, '0')}`;

                const tdFecha = document.createElement('td');
                const fechaBase = venta.createdAt || venta.fecha;
                tdFecha.textContent = fechaBase ? new Date(fechaBase).toLocaleDateString('es-AR') : 'Sin fecha';

                const tdCliente = document.createElement('td');
                tdCliente.textContent = venta.nombre_cliente || 'Cliente Anónimo';

                const tdProductos = document.createElement('td');
                const ul = document.createElement('ul');
                ul.className = "mb-0 small";

                // Mapeo tolerante de relaciones (en Sequelize puede variar según alias del modelo)
                const listaProductos = venta.Productos || venta.productos;

                if (listaProductos && listaProductos.length > 0) {
                    listaProductos.forEach(prod => {
                        const li = document.createElement('li');
                        
                        // Captura segura de la cantidad guardada en la tabla pivot Many-to-Many
                        const tablaPivot = prod.VentaProductos || prod.VentaProducto || prod.through;
                        const cant = tablaPivot ? tablaPivot.cantidad : (prod.cantidad || 1);
                        
                        li.textContent = `${prod.nombre || 'Producto'} x${cant}`;
                        ul.appendChild(li);
                    });
                } else {
                    const liVacio = document.createElement('li');
                    liVacio.className = "text-muted";
                    liVacio.textContent = "Sin detalles";
                    ul.appendChild(liVacio);
                }
                tdProductos.appendChild(ul);

                const tdTotal = document.createElement('td');
                tdTotal.className = "fw-bold text-success";
                const totalFormateado = venta.precio_total ? parseFloat(venta.precio_total).toLocaleString('es-AR') : '0';
                tdTotal.textContent = `$${totalFormateado}`;

                fila.appendChild(tdFactura);
                fila.appendChild(tdFecha);
                fila.appendChild(tdCliente);
                fila.appendChild(tdProductos);
                fila.appendChild(tdTotal);

                tbody.appendChild(fila);
            });

        } catch (error) {
            console.error("Error al traer las ventas de la API:", error);
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-danger fw-bold py-4">
                        Error al conectar con el servidor o procesar los datos de Sequelize.
                    </td>
                </tr>
            `;
        }
    }

    // =========================================================================
    // DISPARADORES E INICIALIZADORES
    // =========================================================================
    if (contenedorProductos) {
        cargarCatalogo();
    }

    if (tablaCarrito) {
        mostrarCarrito();
    }

    if (window.location.pathname.includes('dashboard.html')) {
        cargarDashboard(1);
    }

    if (window.location.pathname.includes('ventas.html')) {
        cargarHistorialVentas();
    }

    const formularioExiste = document.querySelector('form');
    if (formularioExiste) {
        configurarFormularioProducto();
    }
});