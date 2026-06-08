const express = require('express');
const { sequelize } = require('./src/models/index'); // Asegúrate de tener configurado aquí el puerto 3306 para MySQL
const productoRoutes = require('./src/routes/productoRoutes');
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

const app = express();
app.use(express.json());
app.use('/api/productos', productoRoutes);

// Sincronización de la base de datos
sequelize.sync({ force: false })
    .then(() => console.log('Tablas sincronizadas con la base de datos'))
    .catch(err => console.error('Error al sincronizar las tablas:', err));

// Definir el puerto (usa el del archivo .env o el 3000 por defecto)
const PORT = process.env.PORT || 3000;

// El servidor de Express ahora escucha y muestra el puerto correcto (3000) sin chocar con el 3306 de MySQL
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto :${PORT}`));