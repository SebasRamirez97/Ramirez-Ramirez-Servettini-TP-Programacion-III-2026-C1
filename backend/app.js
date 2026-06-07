const express = require('express');
const { sequelize } = require('./src/models/index');
const productoRoutes = require('./src/routes/productoRoutes');

const app = express();
app.use(express.json());
app.use('/api/productos', productoRoutes);

sequelize.sync({ force: false })
    .then(() => console.log('Tablas sincronizadas'))
    .catch(err => console.error('Error al sincronizar:', err));

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));