const {
  getProductosDB,
  getProductoByIdDB,
  crearProductoDB,
  actualizarProductoDB,
  cambiarEstadoProductoDB,
} = require("../services/producto.service");

const getProductos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const esAdministrador = (req.query.admin === 'true');
    const categoria = req.query.categoria;

    const { count, rows } = await getProductosDB(page, limit, esAdministrador, categoria);

    res.json({
      total: count,
      paginas: Math.ceil(count / limit),
      paginaActual: page,
      productos: rows,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

const getProductoById = async (req, res) => {
  try {
    const producto = await getProductoByIdDB(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

const crearProducto = async (req, res) => {
  try {
    const { nombre, categoria, precio, descripcion } = req.body;
    const imagen = req.file?.filename || "default.png";

    const producto = await crearProductoDB({
      nombre, categoria, precio, descripcion, imagen, activo: true
    });

    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio } = req.body;
    const producto = await getProductoByIdDB(id);

    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    const datos = {
      nombre: nombre || producto.nombre,
      precio: precio || producto.precio,
      imagen: req.file ? req.file.filename : producto.imagen,
    };

    const actualizado = await actualizarProductoDB(id, datos);
    res.json({ mensaje: 'Producto modificado con éxito', producto: actualizado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

const cambiarEstadoProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const producto = await cambiarEstadoProductoDB(id, activo);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    res.json({ mensaje: `Producto ${activo ? 'activado' : 'desactivado'} correctamente`, producto });
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar el estado del producto' });
  }
};

module.exports = { getProductos, getProductoById, crearProducto, actualizarProducto, cambiarEstadoProducto };


