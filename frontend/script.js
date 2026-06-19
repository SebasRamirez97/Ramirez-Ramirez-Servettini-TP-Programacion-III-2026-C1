document.addEventListener('DOMContentLoaded', () => {
    
   
    // =========================================================================
     // 1. CAPTURA DE ELEMENTOS DEL DOM
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
    const btnCerrarSesion =document.getElementById('btn-cerrar-sesion');
    
    // Elementos input
    const formularioProducto = document.querySelector('form'); 
    const inputNombre = document.getElementById('nombre');
    const selectCategoria = document.getElementById('categoria');
    const inputPrecio = document.getElementById('precio');
    const inputImagen = document.getElementById('imagen');
  
    // 2. SISTEMA DE TEMAS (Claro / Oscuro)

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

 
    // 3. CONTROLADORES DE NAVEGACIÓN Y FLUJOS GENERALES

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
                // Si el backend devolvió error (404 o 401)
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
                // 1. Le pegamos a tu ruta (por defecto Sequelize va a usar la página 1)
                const respuesta = await fetch('http://localhost:3000/api/administradores');
                
                // 2. Guardamos la respuesta completa del servidor
                const data = await respuesta.json();

                // 3. VALIDACIÓN CLAVE: Nos fijamos que la respuesta sea OK y que la propiedad 
                // "data.administradores" exista y tenga al menos un usuario adentro.
                if (respuesta.ok && data.administradores && data.administradores.length > 0) {
                    
                    // 4. Pescamos el primer administrador de esa lista específica
                    let primerAdmin = data.administradores[0]; 

                    // 5. Rellenamos los casilleros del HTML automáticamente
                    emailAdmin.value = primerAdmin.email;
                    
                    // Poné acá la clave fija que usen para probar (ej: 'admin123' o la que tengan en la BD)
                    contraseñaAdmin.value = '1234567890'; 

                    // 6. Disparamos el login automáticamente para ahorrar un clic
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
    // 4. LÓGICA DE PANTALLA: CATÁLOGO (Nodos Seguros)

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
    // 4.5 LÓGICA DE PANTALLA: dashboard 
    // =========================================================================
    async function cargarDashboard(pagina = 1) {
    
    // 2. Envolvemos todo en un bloque seguro try/catch
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
    
    tabla.textContent = ""; // Limpiamos las filas anteriores

    listaProductos.forEach(function(prod) {
        
        // 🌟 ESTADOS INTERNOS DE ESTA FILA EN PARTICULAR
        let editando = false; 
        let archivoSeleccionado = null; // Guardará la foto nueva si el usuario sube una
        let imagenEliminada = false;    // Guardará si el usuario tocó el tacho de basura

        const fila = document.createElement("tr");

        // Celda 1: ID (Siempre fija)
        const tdId = document.createElement("td");
        tdId.textContent = prod.id;

        // Celda 2: Imagen (Contenedor base)
        const tdImg = document.createElement("td");
        const img = document.createElement("img");
        img.src = `http://localhost:3000/resources/img-productos/${prod.imagen}`;
        img.style.width = "60px";
        img.style.height = "60px";
        img.style.objectFit = "contain";
        tdImg.appendChild(img);

        // Celda 3: Nombre
        const tdNombre = document.createElement("td");
        tdNombre.textContent = prod.nombre;

        // Celda 4: Categoría
        const tdCat = document.createElement("td");
        tdCat.textContent = prod.categoria;

        // Celda 5: Precio
        const tdPrecio = document.createElement("td");
        tdPrecio.textContent = `$${prod.precio}`;

        // Celda 6: Estado (Fijo)
        const tdEstado = document.createElement("td");
        tdEstado.textContent = prod.activo ? "Activo" : "Inactivo";

        // Celda 7: Contenedor de Botones de Acción
        const tdAcciones = document.createElement("td");
        tdAcciones.className = "text-center";

        // Botón Activar / Desactivar
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

        // Botón Editar / Guardar
        const btnEditar = document.createElement("button");
        btnEditar.className = "btn btn-sm btn-primary ms-2";
        btnEditar.textContent = "Editar";

        // =====================================================================
        // LÓGICA DEL BOTÓN EDITAR / GUARDAR (INTERRUPTOR)
        // =====================================================================
        btnEditar.addEventListener("click", async function() {
            
            if (!editando) {
                // -------------------------------------------------------------
                // MODO: ENTRAR A EDICIÓN (Transformar texto en inputs)
                // -------------------------------------------------------------
                editando = true;
                btnEditar.textContent = "Guardar";
                btnEditar.className = "btn btn-sm btn-success ms-2";
                btnEstado.disabled = true; // Congelamos el botón de estado para evitar líos

                // 1. Convertir Nombre a Input
                const inputNombre = document.createElement("input");
                inputNombre.type = "text";
                inputNombre.className = "form-control form-control-sm";
                inputNombre.value = prod.nombre;
                tdNombre.textContent = ""; // Borramos el texto estático
                tdNombre.appendChild(inputNombre);

                // 3. Convertir Precio a Input Numérico
                const inputPrecio = document.createElement("input");
                inputPrecio.type = "number";
                inputPrecio.className = "form-control form-control-sm";
                inputPrecio.value = prod.precio;
                tdPrecio.textContent = "";
                tdPrecio.appendChild(inputPrecio);

                // 4. Agregar Botones de Control de Imagen (A los costados, verticales)
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

                // Input de tipo archivo oculto que se disparará por atrás
                const inputOcultoFile = document.createElement("input");
                inputOcultoFile.type = "file";
                inputOcultoFile.accept = "image/*";
                inputOcultoFile.style.display = "none";

                // Evento para Subir Foto (Simula el clic en el input oculto)
                btnSubirImg.addEventListener("click", function() {
                    inputOcultoFile.click();
                });

                // Cuando el usuario elige la foto, cambiamos la vista previa al instante (Magia en vivo)
                inputOcultoFile.addEventListener("change", function() {
                    if (inputOcultoFile.files.length > 0) {
                        archivoSeleccionado = inputOcultoFile.files[0];
                        imagenEliminada = false;
                        img.src = URL.createObjectURL(archivoSeleccionado); // Cambia el Preview sin tocar el servidor todavía
                    }
                });

                // Evento para Vaciar la Foto (Pone una imagen por defecto)
                btnBorrarImg.addEventListener("click", function() {
                    archivoSeleccionado = null;
                    imagenEliminada = true;
                    inputOcultoFile.value = ""; // Limpiamos la selección por las dudas
                    img.src = "http://localhost:3000/resources/img-productos/default.png"; // Placeholder
                });

                contenedorControlesImg.appendChild(btnSubirImg);
                contenedorControlesImg.appendChild(btnBorrarImg);
                contenedorControlesImg.appendChild(inputOcultoFile);
                tdImg.appendChild(contenedorControlesImg);

                // 5. Agregar un Botón de Cancelar (Por si el admin se arrepiente)
                const btnCancelar = document.createElement("button");
                btnCancelar.className = "btn btn-sm btn-secondary ms-1";
                btnCancelar.textContent = "X";
                btnCancelar.addEventListener("click", function() {
                    cargarDashboard(paginaActual); // La forma más fácil de resetear es recargar la página
                });
                tdAcciones.appendChild(btnCancelar);

            } else {
                // -------------------------------------------------------------
                // MODO: GUARDAR CAMBIOS (Recolección y envío al Backend)
                // -------------------------------------------------------------
                const valorNombre = tdNombre.querySelector("input").value.trim();
                const valorPrecio = tdPrecio.querySelector("input").value;

                if (valorNombre === "" || valorPrecio === "") {
                    alert("Por favor, completá todos los campos antes de guardar.");
                    return;
                }

                // Armamos la valija de edición tradicional
                const valijaEdicion = new FormData();
                valijaEdicion.append("nombre", valorNombre);
                valijaEdicion.append("precio", valorPrecio);

                // Evaluamos qué pasó con la imagen en el formulario
                if (archivoSeleccionado) {
                    valijaEdicion.append("imagen", archivoSeleccionado); // Enviamos el archivo nuevo
                } else if (imagenEliminada) {
                    valijaEdicion.append("imagen", "default.png"); // Avisamos que quedó por defecto
                }

                try {
                    // Le pegamos a tu controlador de actualización: PATCH /api/productos/editar/:id
                    const respuesta = await fetch(`http://localhost:3000/api/productos/editar/${prod.id}`, {
                        method: "PATCH",
                        body: valijaEdicion
                    });

                    if (respuesta.ok) {
                        alert("¡Producto modificado con éxito!");
                        cargarDashboard(paginaActual); // Refrescamos la tabla y congela los cambios
                    } else {
                        alert("Hubo un problema al intentar guardar las modificaciones.");
                    }

                } catch (error) {
                    console.error("Error conectando con el backend en la edición:", error);
                    alert("No se pudo conectar con el servidor.");
                }
            }
        });

        // Ensamblaje de la fila inicial estática
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
            cargarDashboard(i); // recarga la tabla con la página seleccionada
        });
        contenedorPaginacion.appendChild(btnPagina);
    }
}


    // =========================================================================
    // 5. LÓGICA DE PANTALLA: CARRITO (Estructura de Tabla Segura)

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

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

    // 6. LÓGICA DE PANTALLA: TICKET DINÁMICO

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
                        scrollY: 0 // <--- SALVAVIDAS 1: Obliga a sacar la foto desde el inicio de la pantalla, ignorando si el usuario scroleó.
                    },
                    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
                    pagebreak:    { mode: 'avoid-all' } // <--- SALVAVIDAS 2: Le prohíbe terminantemente a la librería romper el diseño en dos hojas.
                };

                html2pdf().set(opcionesConfig).from(elementoTicket).save();
            });
        }
    }

    // 7. Logica para crear productos

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