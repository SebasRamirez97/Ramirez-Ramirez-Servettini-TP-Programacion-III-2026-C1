const sequelize = require('../config/sequelize');
const Producto = require('./Producto');
const Administrador = require('./Administrador');
const Venta = require('./Venta');
const VentaProductos = require('./VentaProductos');

Venta.belongsToMany(Producto, { through: VentaProductos , foreignKey:'ventaId' });
Producto.belongsToMany(Venta, { through: VentaProductos , foreignKey: 'productoId' });

module.exports = { sequelize, Producto, Administrador, Venta, VentaProductos };