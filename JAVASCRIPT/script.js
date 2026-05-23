document.addEventListener('DOMContentLoaded', () => {

    let articulos = [];

    fetch('./articulos.json')
        .then(response => response.json())
        .then(data => {
            articulos = data;
            console.log("¡JSON cargado correctamente!", articulos);
        })
        .catch(error => console.error("Error cargando el archivo JSON:", error));


    const pBienvenida = document.getElementById('pantalla-bienvenida');
    const pCategorias = document.getElementById('pantalla-categorias');
    const pCatalogo = document.getElementById('pantalla-catalogo');

    const btnCarrito = document.getElementById('btn-carrito');
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

    function cambiarPantalla(pantallaOcultar, pantallaMostrar) {
        pantallaOcultar.classList.remove('activa');
        pantallaMostrar.classList.add('activa');


        if (pantallaMostrar === pCatalogo) {
            btnCarrito.classList.remove('d-none');
        } else {
            // Si volvemos atrás o al inicio, lo apagamos
            btnCarrito.classList.add('d-none');
        }
    }
   

    document.getElementById('btn-comprar').addEventListener('click', () => {
        cambiarPantalla(pBienvenida, pCategorias);
    });

    document.getElementById('btn-volver-inicio').addEventListener('click', () => {
        cambiarPantalla(pCategorias, pBienvenida);
    });

    document.getElementById('btn-volver-categorias').addEventListener('click', () => {
        cambiarPantalla(pCatalogo, pBienvenida);
    });


    const contenedorProductos = document.getElementById('contenedor-productos');
    const tituloCatalogo = document.getElementById('titulo-catalogo');

    function mostrarCategoria(categoriaFiltro, textoTitulo) {

        cambiarPantalla(pCategorias, pCatalogo);
        
        tituloCatalogo.textContent = textoTitulo;
        
        while (contenedorProductos.firstChild) {
            contenedorProductos.removeChild(contenedorProductos.firstChild);
        }
        
        const productosFiltrados = articulos.filter(item => item.categoria === categoriaFiltro);

        productosFiltrados.forEach(producto => {
        
        const article = document.createElement('article');
        article.classList.add('producto-card');
    
        const img = document.createElement('img');
        img.src = producto.imagen;            
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


    document.getElementById('btn-cat-powerups').addEventListener('click', () => {
        mostrarCategoria('powerups', 'Power Ups');
    });
<<<<<<< HEAD:script.js
    document.getElementById('btn-cat-vehiculos').addEventListener('click', () => {
        mostrarCategoria('vehiculos', 'Vehículos');
    });


    const botonesNavLateral = document.querySelectorAll('.nav-categoria');
    botonesNavLateral.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const categoria = e.target.getAttribute('data-categoria');
            const titulo = e.target.textContent;
            mostrarCategoria(categoria, titulo);
        });
    });

=======
});
const botonesAgregar = document.querySelectorAll(".btn-agregar");

botonesAgregar.forEach(boton => {
  boton.addEventListener("click", function() {
    
    const card = boton.closest(".producto-card");
    const btnSonido = card.querySelector(".arma-btn");

    if (btnSonido && btnSonido.dataset.sonido) {
      const audio = new Audio(btnSonido.dataset.sonido);
      audio.volume = 1;
      audio.play();
    }

  });
>>>>>>> 402cd125833f4936aab599cab28a69969335d627:JAVASCRIPT/script.js
});