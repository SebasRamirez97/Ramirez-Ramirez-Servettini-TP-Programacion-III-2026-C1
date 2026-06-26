const express = require('express');
const router = express.Router();
const {crearAdministrador ,getAdministradores,
        verificarLogin, mostrarLogin, mostrarDashboard, mostrarFormularioProducto} = require("../controllers/administradorController.js");

router.get("/productos/nuevo", mostrarFormularioProducto);
router.get("/login", mostrarLogin);
router.get("/dashboard", mostrarDashboard);
router.get("/", getAdministradores)

router.post("/login", verificarLogin)
router.post("/signup", crearAdministrador);

module.exports = router;