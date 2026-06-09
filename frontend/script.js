document.addEventListener('DOMContentLoaded', () => {
    

    const contenedorProductos = document.getElementById('contenedor-productos');
    const tituloCatalogo = document.getElementById('titulo-catalogo');
    const btnCarrito = document.getElementById('btn-carrito'); 
    const btnTema = document.getElementById('btn-tema');      
    const nombreCliente = document.getElementById('input-nombre');
    const btnComprar = document.getElementById('btn-comprar');
    const btnVolverInicio = document.getElementById('btn-volver-inicio');
    const btnVolverCategorias = document.getElementById('btn-volver-categorias');
    const nombreGuardado = localStorage.getItem('nombreCliente');
    const elementoCliente = document.getElementById('ticket-cliente');
            if (nombreGuardado && elementoCliente) {
                elementoCliente.textContent = nombreGuardado;
            }
    
    const fechaElemento = document.getElementById('ticket-fecha');
            if (fechaElemento) {
                const ahora = new Date();
                const opcionesFecha = { day: '2-digit', month: 'short', year: 'numeric' };
                const opcionesHora = { hour: '2-digit', minute: '2-digit' };
                fechaElemento.textContent = `${ahora.toLocaleDateString('es-AR', opcionesFecha)} • ${ahora.toLocaleTimeString('es-AR', opcionesHora)}`;
            }

    const btnVolver = document.getElementById('btn-volver-inicio');
            if (btnVolver) {
                btnVolver.addEventListener('click', () => {
                    // Mantenemos el tema pero reiniciamos el nombre para el próximo cliente si se desea
                    localStorage.removeItem('nombreCliente'); 
                    window.location.href = "index.html";
                });
            }

    let articulos = [];


    const temaGuardado = localStorage.getItem('tema');

    if (temaGuardado === 'oscuro') {
        if (btnTema) {
            btnTema.textContent = 'Modo Claro';
            btnTema.classList.remove('btn-dark');
            btnTema.classList.add('btn-light');
        }
    }

    // 3. EVENTO PARA CAMBIAR EL TEMA (BOTÓN)
    if (btnTema) {
        btnTema.addEventListener('click', () => {
            const modoOscuroActivo = document.body.classList.toggle('dark-mode');

            if (modoOscuroActivo) {
                btnTema.textContent = 'Modo Claro';
                btnTema.classList.remove('btn-dark');
                btnTema.classList.add('btn-light');
                localStorage.setItem('tema', 'oscuro');
            } else {
                btnTema.textContent = 'Modo Oscuro';
                btnTema.classList.remove('btn-light');
                btnTema.classList.add('btn-dark');
                localStorage.setItem('tema', 'claro');
            }
        });
    }

    // 4. CARGA DEL JSON Y FILTRADO
    fetch('./articulos.json')
        .then(response => response.json())
        .then(data => {
            articulos = data;
            console.log("¡JSON cargado correctamente!", articulos);

            // Detectar si estamos parados en catalogo.html
            if (tituloCatalogo && contenedorProductos) {
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

    // 5. NAVEGACIÓN Y VALIDACIÓN DEL CLIENTE
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
            location.href = "index.html";
        });
    }

    if (btnVolverCategorias) {
        btnVolverCategorias.addEventListener('click', () => {
            location.href = "categorias.html";
        });
    }

    // 6. RENDERIZADO DINÁMICO DE PRODUCTOS
    function mostrarCategoria(categoriaFiltro, textoTitulo) {
        if (!contenedorProductos || !tituloCatalogo) return;

        tituloCatalogo.textContent = textoTitulo;
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
            
            const spanCantidad = document.createElement('span');
            spanCantidad.textContent = '0';
            spanCantidad.classList.add('cantidad-numero');
            selectorCantidad.appendChild(spanCantidad);
            
            const btnMas = document.createElement('button');
            btnMas.textContent = '+';
            btnMas.classList.add('btn-cantidad');
            selectorCantidad.appendChild(btnMas);
            
            article.appendChild(selectorCantidad);
            
            const btnAgregar = document.createElement('button');
            btnAgregar.textContent = 'Agregar al carrito';
            btnAgregar.classList.add('btn', 'btn-danger', 'w-100');
            article.appendChild(btnAgregar);

            contenedorProductos.appendChild(article);
        });
    }

    // 7. CONTROLADORES DE FILTROS DE CATEGORÍAS
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