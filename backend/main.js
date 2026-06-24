const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models/index');
const path = require('path');

const productoRoutes = require('./src/routes/producto.routes');
const administradorRoutes = require('./src/routes/administrador.routes');
const ventaRoutes = require('./src/routes/venta.routes');

const app = express();
app.use(cors({ origin: 'http://127.0.0.1:5500' }));
app.use(express.json());

// Motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Archivos estáticos (CSS, JS, imágenes de UI)
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Archivos de negocio (logo, imágenes de productos, etc.)
app.use('/resources', express.static(path.join(__dirname,'..', 'resources')));

// Para redirigir al inicio
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));

// Rutas API
app.use('/api/ventas', ventaRoutes);
app.use('/api/administradores', administradorRoutes);
app.use('/api/productos', productoRoutes);

// Rutas de vistas
app.get('/admin/login', (req, res) => {
  res.render('loginAdmin', { 
    titulo: 'Tenkiu - Autoservicio',
    mensajeModal: ''
  });
});

app.get('/admin/dashboard', (req, res) => {
  res.render('dashboard', { 
    titulo: 'Tenkiu - Dashboard Administrador',
    mensajeModal: ''
  });
});

app.get('/admin/dashboard', (req, res) => {
  res.render('dashboard', { titulo: 'Panel de Administración' });
});

app.get('/admin/ventas', (req, res) => {
  res.render('ventas', { titulo: 'Listado de Ventas' });
});

app.get('/admin/producto/nuevo', (req, res) => {
  res.render('formularioProducto', { titulo: 'Nuevo Producto' });
});

sequelize.sync({ force: false })
  .then(() => console.log('Tablas sincronizadas'))
  .catch(err => console.error('Error al sincronizar:', err));

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));