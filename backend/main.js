const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models/index');
const productoRoutes = require('./src/routes/producto.routes');
//const ventaRoutes = require('./src/routes/venta.routes');
const administradorRoutes = require('./src/routes/administrador.routes');
const path = require('path');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://127.0.0.1:5500' // o '*' para permitir todos
}));

app.use('/api/productos', productoRoutes);
//app.use('/api/ventas', ventaRoutes);
app.use('/api/administradores', administradorRoutes);



// 👇 servir la carpeta resources/img como estática
app.use('/img-powerups', express.static(path.join(__dirname, '../resources/img-powerups')));

sequelize.sync({ force: false })
    .then(() => console.log('Tablas sincronizadas'))
    .catch(err => console.error('Error al sincronizar:', err));

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));