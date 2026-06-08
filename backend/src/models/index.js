const sequelize = require('../config/sequelize');
const Producto = require('./Producto');
const Administrador = require('./Administrador');
const Venta = require('./Venta');

// por el momento quiero que se carguen los productos y los diferentes seeders
// Venta.belongsToMany(Producto, { through: 'VentaProductos' });
// Producto.belongsToMany(Venta, { through: 'VentaProductos' });

module.exports = { sequelize, Producto, Administrador, Venta };