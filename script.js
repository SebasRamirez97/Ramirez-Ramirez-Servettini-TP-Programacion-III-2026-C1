document.addEventListener('DOMContentLoaded', () => {
    
    const contenedorProductos = document.getElementById('contenedor-productos');
    const tituloCatalogo = document.getElementById('titulo-catalogo');
    let articulos = [];

    fetch('./articulos.json')
        .then(response => response.json())
        .then(data => {
            articulos = data;
            console.log("¡JSON cargado correctamente!", articulos);

            // Detectar categoría desde la URL (solo en catalogo.html)
            if (tituloCatalogo && contenedorProductos) {
                const params = new URLSearchParams(window.location.search);
                const categoria = params.get("categoria");
                if (categoria) {
                    const titulo = categoria === "powerups" ? "Power Ups" : "Vehículos";
                    mostrarCategoria(categoria, titulo);
                }
            }
        })
        .catch(error => console.error("Error cargando el archivo JSON:", error));

    
    const btnTema = document.getElementById('btn-tema');

    // 4. Lógica de Cambio de Tema (Claro / Oscuro)
    btnTema.addEventListener('click', () => {
        const modoOscuroActivo = document.body.classList.toggle('dark-mode');

        if (modoOscuroActivo) {
            btnTema.textContent = 'Modo Claro';
            btnTema.classList.remove('btn-dark');
            btnTema.classList.add('btn-light');
        } else {
            btnTema.textContent = 'Modo Oscuro';
            btnTema.classList.remove('btn-light');
            btnTema.classList.add('btn-dark');
        }
    });
   
    // Logica de los botones para cambiar de pantalla
    const btnComprar = document.getElementById('btn-comprar');
    if (btnComprar) {
        btnComprar.addEventListener('click', () => {
            location.href = "categorias.html";
        });
    }

    const btnVolverInicio = document.getElementById('btn-volver-inicio');
    if (btnVolverInicio) {
        btnVolverInicio.addEventListener('click', () => {
            location.href = "bienvenida.html";
        });
    }

    const btnVolverCategorias = document.getElementById('btn-volver-categorias');
    if (btnVolverCategorias) {
        btnVolverCategorias.addEventListener('click', () => {
            location.href = "categorias.html";
        });
    }
    const btnCarrito = document.getElementById('btn-carrito');
    if(btnCarrito){
        btnCarrito.addEventListener('click', () => {
            location.href = "carrito.html";
        })
    }



    
    
    //Logica segun categoria
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


    // Botones de categorías
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