const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Venta = sequelize.define('Venta', {
    nombre_cliente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio_total: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

module.exports = Venta;