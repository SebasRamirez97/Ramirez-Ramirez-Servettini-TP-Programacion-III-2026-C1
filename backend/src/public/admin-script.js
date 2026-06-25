document.addEventListener('DOMContentLoaded', () => {
    
    // 1. CAPTURA DE ELEMENTOS EXCLUSIVOS DE ADMIN
    const emailAdmin = document.getElementById('input-email');
    const contraseñaAdmin = document.getElementById('input-contraseña');
    const btnIngresarAdmin = document.getElementById('btn-ingresar-admin');
    const btnAccesoRapido = document.getElementById('btn-acceso-rapido');
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    const btnTema = document.getElementById('btn-tema');      

    const inputNombre = document.getElementById('nombre');
    const selectCategoria = document.getElementById('categoria');
    const inputPrecio = document.getElementById('precio');
    const inputImagen = document.getElementById('imagen');

    // 2. SISTEMA DE TEMAS PARA EL PANEL
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

    // 3. LOGIC DE INGRESO (LOGIN)
    if (btnIngresarAdmin) {
        btnIngresarAdmin.addEventListener('click', async () => {
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
                    modalBody.textContent = data.error;
                    modalLogin.show();
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
                    contraseñaAdmin.value = 'coso1234'; 
                    btnIngresarAdmin.click();
                } else {
                    alert('No se encontraron administradores registrados en el sistema.');
                }
            } catch (error) {
                console.error('Error en el acceso rápido:', error);
            }
        });
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', () => {
            location.href = "/api/administradores/login";
        });
    }

    // 4. LOGIC DEL DASHBOARD (EJS INTERACTIVO)
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
                        const modalEdit = new bootstrap.Modal(document.getElementById('modalEdit'));
                        const modalBodyEdit = document.querySelector("#modalEdit .modal-body");
                        modalBodyEdit.textContent = "Por favor completa todos los campos"
                        modalEdit.show();
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
                            const modalEdit = new bootstrap.Modal(document.getElementById('modalEdit'));
                            const modalBodyEdit = document.querySelector("#modalEdit .modal-body");
                            modalBodyEdit.textContent = "Producto editado"
                            modalEdit.show();
                            //window.location.reload();
                        } else {
                            const modalEdit = new bootstrap.Modal(document.getElementById('modalEdit'));
                            const modalBodyEdit = document.querySelector("#modalEdit .modal-body");
                            modalBodyEdit.textContent = "Hubo un problema al editar el producto"
                            modalEdit.show();
                        }
                    } catch (error) {
                        console.error("Error guardando edición inline:", error);
                    }
                }
            });
        });
    }

    // 5. FORMULARIO DE ALTA DE PRODUCTOS
    const formularioExiste = document.querySelector('form');
    if (formularioExiste) {
        configurarFormularioProducto();
    }

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
                    const modalFormulario = new bootstrap.Modal(document.getElementById('modalFormulario'));
                    const modalBodyFormulario = document.querySelector("#modalFormulario .modal-body");
                    modalBodyFormulario.textContent = "Producto guardado con exito"
                    modalFormulario.show();

                } else {
                    const modalFormulario = new bootstrap.Modal(document.getElementById('modalFormulario'));
                    const modalBodyFormulario = document.querySelector("#modalFormulario .modal-body");
                    modalBodyFormulario.textContent = "Error alcargar en el servidor, revisar los campos"
                    modalFormulario.show();                    
                }
            } catch (error) {
                console.error('Error de conexión:', error);
            }
        });
    }

    // 6. EXPORTAR A EXCEL (PANEL DE VENTAS)
    const btnExportarExcel = document.getElementById('btn-exportar-excel');
    if (btnExportarExcel) {
        btnExportarExcel.addEventListener('click', () => {
            const tabla = document.getElementById('tabla-ventas') || document.querySelector('table');
            if (!tabla) {
                alert('No se encontró la tabla de ventas para exportar.');
                return;
            }
            const hojaTrabajo = XLSX.utils.table_to_sheet(tabla);
            const libroTrabajo = XLSX.utils.book_new();
            XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(libroTrabajo, hojaTrabajo, "Historial Ventas");
            const fechaActual = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(libroTrabajo, `Reporte_Ventas_${fechaActual}.xlsx`);
        });
    }
});