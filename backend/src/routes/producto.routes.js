const express = require('express');
const router = express.Router();
const imgMiddlewares = require('../middlewares/upload');
const { getProductos, getProductoById, actualizarProducto, crearProducto} = require('../controllers/productoController');

router.get('/:id', getProductoById);
router.get('/', getProductos);

router.post("/crear", imgMiddlewares.single('imagen'), crearProducto);

router.patch('/editar/:id', imgMiddlewares.single('imagen'), actualizarProducto);

module.exports = router;