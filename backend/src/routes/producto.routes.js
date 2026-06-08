const express = require('express');
const router = express.Router();
const { getProductos, getProductoById } = require('../controllers/productoController');

router.get('/:id', getProductoById);

router.get('/', getProductos);

module.exports = router;