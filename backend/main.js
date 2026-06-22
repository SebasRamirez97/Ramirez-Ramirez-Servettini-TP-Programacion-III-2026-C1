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
//app.set('view engine', 'ejs');
//app.set('views','./vistas');


app.use('/api/ventas', ventaRoutes);
app.use('/api/administradores', administradorRoutes);
app.use('/api/productos/', productoRoutes);
app.use('/resources', express.static(path.join(__dirname, 'resources')));

sequelize.sync({ force: false })
    .then(() => console.log('Tablas sincronizadas'))
    .catch(err => console.error('Error al sincronizar:', err));

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));