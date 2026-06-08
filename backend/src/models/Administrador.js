const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Administrador = sequelize.define('Administrador', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Administrador;