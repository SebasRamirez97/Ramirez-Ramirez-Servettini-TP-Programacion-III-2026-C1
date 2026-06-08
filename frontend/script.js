document.addEventListener('DOMContentLoaded', () => {
    
    // 1. CAPTURA DE ELEMENTOS DEL DOM (Siempre arriba de todo)
    const contenedorProductos = document.getElementById('contenedor-productos');
    const tituloCatalogo = document.getElementById('titulo-catalogo');
    const btnCarrito = document.getElementById('btn-carrito'); 
    const btnTema = document.getElementById('btn-tema');       
    
    let articulos = [];

    // NUEVO: Aplicar el tema guardado inmediatamente al cargar la página
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado === 'oscuro') {
        document.body.classList.add('dark-mode');
        if (btnTema) {
            btnTema.textContent = 'Modo Claro';
            btnTema.classList.remove('btn-dark');
            btnTema.classList.add('btn-light');
        }
    }

    // 2. CARGA DEL ARCHIVO JSON Y DETECCIÓN DE PANTALLA
    fetch('./articulos.json')
        .then(response => response.json())
        .then(data => {
            articulos = data;
            console.log("¡JSON cargado correctamente!", articulos);

            // Detectar si estamos parados en catalogo.html
            if (tituloCatalogo && contenedorProductos) {
                
                // Si el botón existe en este HTML, le quitamos el oculto
                if (btnCarrito) {
                    btnCarrito.classList.remove('d-none');
                }

                const params = new URLSearchParams(window.location.search);
                const categoria = params.get("categoria");
                if (categoria) {
                    const titulo = categoria === "powerups" ? "Power Ups" : "Vehículos";
                    mostrarCategoria(categoria, titulo);
                }
            }
        })
        .catch(error => console.error("Error cargando el archivo JSON:", error));

    // 3. LÓGICA DE CAMBIO DE TEMA (CLARO / OSCURO) CON PERSISTENCIA
    if (btnTema) {
        btnTema.addEventListener('click', () => {
            const modoOscuroActivo = document.body.classList.toggle('dark-mode');

            if (modoOscuroActivo) {
                btnTema.textContent = 'Modo Claro';
                btnTema.classList.remove('btn-dark');
                btnTema.classList.add('btn-light');
                // Guardar preferencia
                localStorage.setItem('tema', 'oscuro');
            } else {
                btnTema.textContent = 'Modo Oscuro';
                btnTema.classList.remove('btn-light');
                btnTema.classList.add('btn-dark');
                // Guardar preferencia
                localStorage.setItem('tema', 'claro');
            }
        });
    }
  
    // 4. LÓGICA DE NAVEGACIÓN ENTRE PÁGINAS HTML
    const btnComprar = document.getElementById('btn-comprar');
    if (btnComprar) {
        btnComprar.addEventListener('click', () => {
            location.href = "categorias.html";
        });
    }

    const btnVolverInicio = document.getElementById('btn-volver-inicio');
    if (btnVolverInicio) {
        btnVolverInicio.addEventListener('click', () => {
            location.href = "index.html";
        });
    }

    const btnVolverCategorias = document.getElementById('btn-volver-categorias');
    if (btnVolverCategorias) {
        btnVolverCategorias.addEventListener('click', () => {
            location.href = "categorias.html";
        });
    }

    // Lógica del botón principal del Carrito (Redirección a la página del carrito)
    if (btnCarrito) {
        btnCarrito.addEventListener('click', () => {
            location.href = "carrito.html";
        });
    }

    // 5. RENDERIZADO DINÁMICO DE PRODUCTOS Y ASIGNACIÓN DE EVENTOS
    function mostrarCategoria(categoriaFiltro, textoTitulo) {

        if (!contenedorProductos || !tituloCatalogo) return;

        tituloCatalogo.textContent = textoTitulo;

        // Limpiar productos previos
        contenedorProductos.innerHTML = "";
        const productosFiltrados = articulos.filter(item => item.categoria === categoriaFiltro);

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
            
            const selectorCantidad = document.createElement('div');
            selectorCantidad.classList.add('selector-cantidad');
            
            const btnMenos = document.createElement('button');
            btnMenos.textContent = '-';
            btnMenos.classList.add('btn-cantidad');
            selectorCantidad.appendChild(btnMenos);
            
            // Los artículos arrancan siempre en 1
            const spanCantidad = document.createElement('span');
            spanCantidad.textContent = '1';
            spanCantidad.classList.add('cantidad-numero');
            selectorCantidad.appendChild(spanCantidad);
            
            const btnMas = document.createElement('button');
            btnMas.textContent = '+';
            btnMas.classList.add('btn-cantidad');
            selectorCantidad.appendChild(btnMas);
            
            article.appendChild(selectorCantidad);
            
            const btnAgregar = document.createElement('button');
            btnAgregar.textContent = 'Agregar al carrito';
            btnAgregar.classList.add('btn', 'btn-danger', 'w-100', 'btn-agregar');
            article.appendChild(btnAgregar);

            // ==========================================
            // ESCUCHADORES DE EVENTOS EN TIEMPO REAL
            // ==========================================

            // Botón Más
            btnMas.addEventListener('click', () => {
                let cantidad = Number(spanCantidad.textContent);
                cantidad++;
                spanCantidad.textContent = cantidad;
            });

            // Botón Menos (No permite bajar de 1)
            btnMenos.addEventListener('click', () => {
                let cantidad = Number(spanCantidad.textContent);
                if (cantidad > 1) {
                    fancyOpacity = 1;
                    cantidad--;
                    spanCantidad.textContent = cantidad;
                }
            });

            // Botón Agregar al Carrito
            btnAgregar.addEventListener('click', () => {
                const cantidadSeleccionada = Number(spanCantidad.textContent);

                if (cantidadSeleccionada <= 0) {
                    alert("Seleccione una cantidad válida");
                    return;
                }

                let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

                const productoExistente = carrito.find(item => item.nombre === producto.nombre);

                if (productoExistente) {
                    productoExistente.cantidad += cantidadSeleccionada;
                } else {
                    carrito.push({
                        nombre: producto.nombre,
                        precio: producto.precio,
                        cantidad: cantidadSeleccionada
                    });
                }

                localStorage.setItem("carrito", JSON.stringify(carrito));

                // Al agregar con éxito, el contador vuelve a 1
                spanCantidad.textContent = "1";

                alert(`"${producto.nombre}" (x${cantidadSeleccionada}) agregado al carrito.`);
            });

            contenedorProductos.appendChild(article);
        });
    }

    // 6. CONTROLADORES DE FILTROS DE CATEGORÍAS
    const btnCatPowerups = document.getElementById('btn-cat-powerups');
    if (btnCatPowerups) {
        btnCatPowerups.addEventListener('click', () => {
            location.href = "catalogo.html?categoria=powerups";
        });
    }

    const btnCatVehiculos = document.getElementById('btn-cat-vehiculos');
    if (btnCatVehiculos) {
        btnCatVehiculos.addEventListener('click', () => {
            location.href = "catalogo.html?categoria=vehiculos";
        });
    }

    const botonesNavLateral = document.querySelectorAll('.nav-categoria');
    if (botonesNavLateral.length > 0) {
        botonesNavLateral.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const categoria = e.target.getAttribute('data-categoria');
                location.href = `catalogo.html?categoria=${categoria}`;
            });
        });
    }
});