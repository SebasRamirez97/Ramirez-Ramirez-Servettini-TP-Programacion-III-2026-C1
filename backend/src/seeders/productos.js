const { Producto } = require('../models/index');

const productos = [
    { nombre: 'Heavy Machine Gun', categoria: 'powerups', precio: 1500, imagen: 'heavy_machine_gun.png', descripcion: 'Arma básica automática' },
    { nombre: 'Flame Shot', categoria: 'powerups', precio: 2000, imagen: 'flame_shot.png', descripcion: 'Lanzallamas de corto alcance' },
    { nombre: 'Rocket Launcher', categoria: 'powerups', precio: 2500, imagen: 'rocket_launcher.png', descripcion: 'Lanza cohetes guiados' },
    { nombre: 'Shotgun', categoria: 'powerups', precio: 1800, imagen: 'shot_gun.png', descripcion: 'Disparo de amplio espectro' },
    { nombre: 'Enemy Chaser', categoria: 'powerups', precio: 3000, imagen: 'enemy_chaser.png', descripcion: 'Misiles teledirigidos' },
    { nombre: 'Laser Gun', categoria: 'powerups', precio: 3500, imagen: 'laser_gun.png', descripcion: 'Rayo láser penetrante' },
    { nombre: 'Super Grenade', categoria: 'powerups', precio: 2800, imagen: 'sg.png', descripcion: 'Granadas explosivas múltiples' },
    { nombre: 'Iron Lizard', categoria: 'powerups', precio: 4000, imagen: 'il.jpg', descripcion: 'Tanque robot de ataque' },
    { nombre: 'Drop Shot', categoria: 'powerups', precio: 2200, imagen: 'ds.jpg', descripcion: 'Balas que rebotan en el suelo' },
    { nombre: 'Thunder Shot', categoria: 'powerups', precio: 4500, imagen: 'ts.jpg', descripcion: 'Ráfagas eléctricas en cadena' },
    { nombre: 'SV-001 Metal Slug', categoria: 'vehiculos', precio: 50000, imagen: 'metal-slug.jpg', descripcion: 'Tanque estándar con cañón principal' },
    { nombre: 'Slug Flyer', categoria: 'vehiculos', precio: 75000, imagen: 'slug-flyer.jpg', descripcion: 'Aeronave de combate con misiles aéreos' },
    { nombre: 'Slug Mariner', categoria: 'vehiculos', precio: 60000, imagen: 'slug-mariner.jpg', descripcion: 'Submarino torpedero para batallas acuáticas' },
    { nombre: 'Elephant Slug', categoria: 'vehiculos', precio: 45000, imagen: 'elephant-slug.jpg', descripcion: 'Tanque con forma de elefante' },
    { nombre: 'Truck Slug', categoria: 'vehiculos', precio: 35000, imagen: 'truck-slug.jpg', descripcion: 'Camión blindado con lanzacohetes' }
];

const seedProductos = async () => {
    try {
        await Producto.bulkCreate(productos);
        console.log('Productos cargados correctamente');
        process.exit(0);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        process.exit(1);
    }
};

seedProductos();