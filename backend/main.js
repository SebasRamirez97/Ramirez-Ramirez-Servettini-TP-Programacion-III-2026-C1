const express = require('express');
const { sequelize } = require('./src/models/index');
const productoRoutes = require('./src/routes/producto.routes');
//const ventaRoutes = require('./src/routes/venta.routes');
const administradorRoutes = require('./src/routes/administrador.routes');

const app = express();
app.use(express.json());

app.use('/api/productos', productoRoutes);
//app.use('/api/ventas', ventaRoutes);
app.use('/api/administradores', administradorRoutes);

sequelize.sync({ force: false })
    .then(() => console.log('Tablas sincronizadas'))
    .catch(err => console.error('Error al sincronizar:', err));

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));