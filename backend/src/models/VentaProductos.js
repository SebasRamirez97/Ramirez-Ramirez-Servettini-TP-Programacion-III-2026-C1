const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const VentaProductos = sequelize.define('VentaProductos', {
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
});

module.exports = VentaProductos;