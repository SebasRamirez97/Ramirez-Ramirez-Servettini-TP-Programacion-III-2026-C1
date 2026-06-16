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
    console.log("Este es mi tipo: " , this.tipo);
    try{
        const { count, rows } = await Producto.findAndCountAll({
            where: Producto.tipo = tipo ? {tipo} : {}
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