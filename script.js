const botones = document.querySelectorAll('.btn-categoria');
botones.forEach(boton => {
    boton.addEventListener('click', function() {
        const item = this.parentNode;
        item.classList.toggle('activo');

        // Si se acaba de abrir, hacemos un scroll suave hacia el botón
        if (item.classList.contains('activo')) {
            setTimeout(() => {
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300); // Espera un poquito a que empiece la animación
        }
    });
});

// 2. Clic en el menú lateral para viajar y ABRIR el contenido
const linksMenu = document.querySelectorAll('.menu-lateral a');
linksMenu.forEach(link => {
    link.addEventListener('click', function() {
        const idDestino = this.getAttribute('href');
        
        if (idDestino.startsWith('#')) {
            const seccion = document.querySelector(idDestino);
            if (seccion) {
                seccion.classList.add('activo'); // Lo abre automáticamente
            }
        }
    });
});