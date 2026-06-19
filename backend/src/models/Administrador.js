const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

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
},{
    tableName: "administradores"

});

module.exports = Administrador;