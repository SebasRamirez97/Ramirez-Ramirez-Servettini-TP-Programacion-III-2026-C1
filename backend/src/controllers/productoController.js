const { Producto } = require('../models/index');

const getProductos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const offset = (page - 1) * limit;

        const { count, rows } = await Producto.findAndCountAll({
            where: { activo: true },
            limit,
            offset
        });

        res.json({
            total: count,
            paginas: Math.ceil(count / limit),
            paginaActual: page,
            productos: rows
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

module.exports = { getProductos };