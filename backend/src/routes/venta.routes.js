const express = require('express');
const router = express.Router();
const { crearVenta , getVentas , mostrarVentasPanel} = require('../controllers/ventaController');

router.get('/panel', mostrarVentasPanel);
router.get('/',getVentas);
router.post('/crear', crearVenta);

module.exports = router;