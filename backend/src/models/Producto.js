const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Producto = sequelize.define('Producto', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoria: {
        type: DataTypes.ENUM('powerups', 'vehiculos'),
        allowNull: false
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Producto;