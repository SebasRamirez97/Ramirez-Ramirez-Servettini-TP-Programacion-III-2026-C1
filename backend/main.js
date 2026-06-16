const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models/index');
const path = require('path');

const productoRoutes = require('./src/routes/producto.routes');
const administradorRoutes = require('./src/routes/administrador.routes');
//const ventaRoutes = require('./src/routes/venta.routes');


const app = express();
app.use(cors({
  origin: 'http://127.0.0.1:5500' // o '*' para permitir todos
}));
app.use(express.json());


//app.use('/api/ventas', ventaRoutes);
app.use('/api/administradores', administradorRoutes);
app.use('/api/productos/', productoRoutes);



//servir la carpeta resources/img como estática
app.use('/img-powerups', express.static(path.join(__dirname, '../resources/img-powerups')));

sequelize.sync({ force: false })
    .then(() => console.log('Tablas sincronizadas'))
    .catch(err => console.error('Error al sincronizar:', err));

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));