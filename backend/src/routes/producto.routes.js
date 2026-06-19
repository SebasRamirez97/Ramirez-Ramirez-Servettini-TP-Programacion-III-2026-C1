const express = require('express');
const router = express.Router();
const { verificarIdEntero } = require('../middlewares/validarInt')
const imgMiddlewares = require('../middlewares/upload');
const { getProductos, getProductoById, actualizarProducto, crearProducto} = require('../controllers/productoController');

router.get('/:id', verificarIdEntero, getProductoById);

router.get('/', getProductos);

router.post("/crear", imgMiddlewares.single('imagen'), crearProducto);

router.patch('/editar/:id',verificarIdEntero, imgMiddlewares.single('imagen'), actualizarProducto);

module.exports = router;