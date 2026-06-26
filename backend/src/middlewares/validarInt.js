const { z } = require("zod");

function verificarIdEntero(req, res, next) {
    z.coerce.number().int().positive().parse(req.params.id);
    next();
}

module.exports = { verificarIdEntero };