const express = require('express');
const productoRoutes = require('./src/routes/producto.routes');

const app = express();
const port = 3000;

app.use(express.json());

// rutas
app.use('/api/productos', productoRoutes);

// prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando sin base de datos');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});