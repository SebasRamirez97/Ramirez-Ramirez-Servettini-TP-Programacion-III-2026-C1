const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models/index');
const path = require('path');

const productoRoutes = require('./src/routes/producto.routes');
const administradorRoutes = require('./src/routes/administrador.routes');
const ventaRoutes = require('./src/routes/venta.routes');

const app = express();


const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN, // Se conectará de forma segura con la variable de entorno de Render
  tracesSampleRate: 1.0,
});

// CORRECCIÓN 1: Permitir solicitudes desde cualquier origen o agregar el de tu frontend en producción
app.use(cors()); // O puedes dejarlo abierto con cors() para pruebas, o configurarlo dinámicamente

app.use(express.json());
app.use(express.static('./src/public'));
app.use(express.static('../frontend'));
app.use(express.static('../resources'));
app.set('view engine', 'ejs');
app.set('views','./src/views/');

// Rutas API
app.use('/api/ventas', ventaRoutes);
app.use('/api/administradores', administradorRoutes);
app.use('/api/productos/', productoRoutes);
app.use('/resources', express.static('resources'));

app.use((req, res, next) => {
    res.status(404).json({ 
        error: "Not Found",
        message: `El endpoint requested [${req.method} ${req.url}] no existe.` 
    });
});

sequelize.sync({ force: false })
  .then(() => console.log('Tablas sincronizadas'))
  .catch(err => console.error('Error al sincronizar:', err));

// CORRECCIÓN 2: Usar process.env.PORT que provee Render (con respaldo al 3000 para desarrollo local)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
