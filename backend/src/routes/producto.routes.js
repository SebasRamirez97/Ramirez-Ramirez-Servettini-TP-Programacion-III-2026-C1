const express = require('express');
const router = express.Router();
const imgMiddlewares = require('../middlewares/upload');
const { getProductos, getProductoById, actualizarProducto } = require('../controllers/productoController');

router.get('/:id', getProductoById);

router.patch('/editar/:id', imgMiddlewares.single('imagen'), actualizarProducto);

router.get('/', getProductos);

module.exports = router;