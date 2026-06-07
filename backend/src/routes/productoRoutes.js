const express = require('express');
const router = express.Router();
const { getProductos } = require('../controllers/productoController');

router.get('/', getProductos);

module.exports = router;