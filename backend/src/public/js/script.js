document.addEventListener('DOMContentLoaded', () => {

    // Elementos de loginAdmin (Bienvenida)
    const emailAdmin = document.getElementById('input-email');
    const contraseñaAdmin = document.getElementById('input-contraseña');
    const btnIngresarAdmin = document.getElementById('btn-ingresar-admin');
    const btnAccesoRapido = document.getElementById('btn-acceso-rapido');

    // Elementos Comunes y Navegación
    const btnTema = document.getElementById('btn-tema');
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
            location.href = "/admin/dashboard";

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
                    contraseñaAdmin.value = 'coso1234'; 

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
            location.href = "/admin/login";
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
});
