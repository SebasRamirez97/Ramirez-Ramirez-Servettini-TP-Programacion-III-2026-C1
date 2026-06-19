const express = require('express');
const router = express.Router();
const validarId = require('../middlewares/validarId'); // <-- Middleware importado

const {
    getProductos,
    crearProducto,
    eliminarProducto
} = require('../controllers/productoController');

router.get('/', getProductos);
router.post('/', crearProducto);

// Primero valida el ID, si pasa, ejecuta la eliminación
router.delete('/:id', validarId, eliminarProducto);

module.exports = router;