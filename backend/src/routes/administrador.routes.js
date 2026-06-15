const express = require('express');
const router = express.Router();
const {mostrarProductos, filtrarProductos} = require("../controllers/administradorController.js");

router.get('/', mostrarProductos);

router.get('/categoria/:tipo', filtrarProductos);

module.exports = router;