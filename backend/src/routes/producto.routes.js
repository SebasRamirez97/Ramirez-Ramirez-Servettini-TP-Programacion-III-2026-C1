const express = require('express');
const router = express.Router();

const imgMiddlewares = require('../middlewares/upload');
const { verificarIdEntero } = require('../middlewares/validarInt')
const { validarCrearProducto, validarEditarProducto } = require("../middlewares/validarProducto");

const { getProductos, getProductoById,
        actualizarProducto, crearProducto ,
        cambiarEstadoProducto} = require('../controllers/productoController');

router.get('/:id', verificarIdEntero, getProductoById);
router.get('/', getProductos);

router.post("/crear", imgMiddlewares.single('imagen'), validarCrearProducto, crearProducto);

router.patch('/editar/:id',verificarIdEntero, imgMiddlewares.single('imagen'), validarEditarProducto, actualizarProducto);
router.patch('/:id/estado',verificarIdEntero, cambiarEstadoProducto);

module.exports = router;