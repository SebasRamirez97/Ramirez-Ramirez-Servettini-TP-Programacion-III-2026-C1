const productos = [
    { id: 1, nombre: 'Heavy Machine Gun', categoria: 'powerups', precio: 1500, imagen: 'heavy_machine_gun.png', descripcion: 'Arma básica automática' },
    { id: 2, nombre: 'Flame Shot', categoria: 'powerups', precio: 2000, imagen: 'flame_shot.png', descripcion: 'Lanzallamas de corto alcance' },
    { id: 3, nombre: 'Rocket Launcher', categoria: 'powerups', precio: 2500, imagen: 'rocket_launcher.png', descripcion: 'Lanza cohetes guiados' },
    { id: 4, nombre: 'Shotgun', categoria: 'powerups', precio: 1800, imagen: 'shot_gun.png', descripcion: 'Disparo de amplio espectro' },
    { id: 5, nombre: 'Enemy Chaser', categoria: 'powerups', precio: 3000, imagen: 'enemy_chaser.png', descripcion: 'Misiles teledirigidos' },
    { id: 6, nombre: 'Laser Gun', categoria: 'powerups', precio: 3500, imagen: 'laser_gun.png', descripcion: 'Rayo láser penetrante' },
    { id: 7, nombre: 'Super Grenade', categoria: 'powerups', precio: 2800, imagen: 'sg.png', descripcion: 'Granadas explosivas múltiples' },
    { id: 8, nombre: 'Iron Lizard', categoria: 'powerups', precio: 4000, imagen: 'il.jpg', descripcion: 'Tanque robot de ataque' },
    { id: 9, nombre: 'Drop Shot', categoria: 'powerups', precio: 2200, imagen: 'ds.jpg', descripcion: 'Balas que rebotan en el suelo' },
    { id: 10, nombre: 'Thunder Shot', categoria: 'powerups', precio: 4500, imagen: 'ts.jpg', descripcion: 'Ráfagas eléctricas en cadena' },
    { id: 11, nombre: 'SV-001 Metal Slug', categoria: 'vehiculos', precio: 50000, imagen: 'metal-slug.jpg', descripcion: 'Tanque estándar con cañón principal' },
    { id: 12, nombre: 'Slug Flyer', categoria: 'vehiculos', precio: 75000, imagen: 'slug-flyer.jpg', descripcion: 'Aeronave de combate con misiles aéreos' },
    { id: 13, nombre: 'Slug Mariner', categoria: 'vehiculos', precio: 60000, imagen: 'slug-mariner.jpg', descripcion: 'Submarino torpedero para batallas acuáticas' },
    { id: 14, nombre: 'Elephant Slug', categoria: 'vehiculos', precio: 45000, imagen: 'elephant-slug.jpg', descripcion: 'Tanque con forma de elefante' },
    { id: 15, nombre: 'Truck Slug', categoria: 'vehiculos', precio: 35000, imagen: 'truck-slug.jpg', descripcion: 'Camión blindado con lanzacohetes' }
];

console.log("Productos cargados en memoria:");
console.log(productos);

process.exit(0);