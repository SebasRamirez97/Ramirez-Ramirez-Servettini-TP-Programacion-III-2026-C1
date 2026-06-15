const express = require('express');
const router = express.Router();

const {
    getProductos,
    crearProducto,
    eliminarProducto
} = require('../controllers/productoController');

router.get('/', getProductos);
router.post('/', crearProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;