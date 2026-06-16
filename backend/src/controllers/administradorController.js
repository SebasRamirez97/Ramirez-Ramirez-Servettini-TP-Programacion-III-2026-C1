const { where } = require('sequelize');
const {Administrador , Producto} = require('../models/index');

const mostrarProductos = async (req, res) => {
    try{
        const { count, rows } = await Producto.findAndCountAll();

            res.json({
                total: count,
                productos: rows
            });

        } catch (error) {
            res.status(500).json({ error: 'Error al obtener productos' });
    }
};

const filtrarProductos = async (req, res) => {
    const {tipo} = req.params;
    let producto = await tipo;
    console.log("Este es mi tipo: " , producto);
    try{
        const { count, rows } = await Producto.findAndCountAll({
            where: {categoria : tipo }
        });

            res.json({
                total: count,
                productos: rows
            });

        } catch (error) {
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    };

module.exports={
    mostrarProductos, filtrarProductos
};