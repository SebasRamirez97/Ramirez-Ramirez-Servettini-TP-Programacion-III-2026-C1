const express = require('express');
const router = express.Router();
const verificarLogin = require('../controllers/administradorController');

router.post("/login", verificarLogin)

module.exports = router;