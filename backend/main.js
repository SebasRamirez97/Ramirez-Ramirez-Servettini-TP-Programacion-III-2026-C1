const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models/index');
const path = require('path');

const productoRoutes = require('./src/routes/producto.routes');
const administradorRoutes = require('./src/routes/administrador.routes');
const ventaRoutes = require('./src/routes/venta.routes');

const app = express();

app.use(cors({origin: 'http://127.0.0.1:5500' }));
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

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
