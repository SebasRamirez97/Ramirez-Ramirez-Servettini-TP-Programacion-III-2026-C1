const { Producto } = require('../models/index');

const getProductosDB = async (page, limit, esAdministrador, categoria) => {
  const offset = (page - 1) * limit;
  let filtro = {};

  if (!esAdministrador) filtro.activo = true;
  if (categoria) filtro.categoria = categoria;

  return await Producto.findAndCountAll({ where: filtro, limit, offset });
};

const getProductoByIdDB = async (id) => {
  return await Producto.findByPk(id);
};

const crearProductoDB = async (producto) => {
  return await Producto.create(producto);
};

const actualizarProductoDB = async (id, datos) => {
  const producto = await Producto.findByPk(id);
  if (!producto) return null;
  await producto.update(datos);
  return producto;
};

const cambiarEstadoProductoDB = async (id, activo) => {
  const producto = await Producto.findByPk(id);
  if (!producto) return null;
  await producto.update({ activo });
  return producto;
};

module.exports = {
  getProductosDB,
  getProductoByIdDB,
  crearProductoDB,
  actualizarProductoDB,
  cambiarEstadoProductoDB,
};