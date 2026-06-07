const sequelize = require('../config/database');
const Producto = require('./Producto');
const Administrador = require('./Administrador');
const Venta = require('./Venta');

// Una venta tiene muchos productos, y un producto puede estar en muchas ventas
Venta.belongsToMany(Producto, { through: 'VentaProductos' });
Producto.belongsToMany(Venta, { through: 'VentaProductos' });

module.exports = { sequelize, Producto, Administrador, Venta };