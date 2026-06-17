const express = require('express');
const router = express.Router();
const {crearAdministrador ,getAdministradores, verificarLogin} = require("../controllers/administradorController.js");


router.get("/", getAdministradores)

router.post("/login", verificarLogin)

router.post("/signup", crearAdministrador);

module.exports = router;