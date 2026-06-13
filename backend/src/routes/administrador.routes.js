const express = require('express');
const router = express.Router();

const {crearAdministrador ,getAdministradores, verificarLogin} = require('../controllers/administradorController');

router.post("/login", verificarLogin)
router.get("/", getAdministradores)

router.post("/signup", crearAdministrador);

module.exports = router;