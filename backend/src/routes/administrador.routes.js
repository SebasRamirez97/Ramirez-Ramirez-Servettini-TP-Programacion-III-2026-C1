const express = require('express');
const router = express.Router();
const {mostrarProductos, filtrarProductos,crearAdministrador ,getAdministradores, verificarLogin} = require("../controllers/administradorController.js");

router.get('/productos/', mostrarProductos);

router.get('/categoria/:tipo', filtrarProductos);

router.get("/", getAdministradores)

router.post("/login", verificarLogin)

router.post("/signup", crearAdministrador);

module.exports = router;