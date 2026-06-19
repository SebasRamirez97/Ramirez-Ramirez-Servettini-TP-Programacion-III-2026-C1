const express = require('express');
const router = express.Router();
const imgMiddlewares = require('../middlewares/upload');
const { getProductos, getProductoById, actualizarProducto } = require('../controllers/productoController');
const validarId = require('../middlewares/validarId'); // <-- Middleware importado

// Si en algún momento habilitas esta ruta, también queda protegida:
// router.get('/:id', validarId, getProductoById);

// Primero valida el ID, luego procesa la imagen y por último va al controlador
router.patch('/editar/:id', validarId, imgMiddlewares.single('imagen'), actualizarProducto);

router.get('/', getProductos);

module.exports = router;