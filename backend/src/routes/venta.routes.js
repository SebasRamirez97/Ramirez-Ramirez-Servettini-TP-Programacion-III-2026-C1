const express = require('express');
const router = express.Router();
const { crearVenta , getVentas } = require('../controllers/ventaController');

router.get('/',getVentas);
router.post('/crear', crearVenta);

module.exports = router;