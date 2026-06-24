const bcrypt = require("bcrypt");
const {
  crearAdministradorDB,
  getAdministradoresDB,
  buscarAdminPorEmailDB,
} = require("../services/administrador.service");

const crearAdministrador = async (req, res) => {
  try {
    const { email, password } = req.body;
    const nuevoAdmin = await crearAdministradorDB(email, password);
    res.status(201).json({ mensaje: "Administrador creado", admin: nuevoAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdministradores = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const { count, rows } = await getAdministradoresDB(page, limit);

    res.json({
      total: count,
      paginas: Math.ceil(count / limit),
      paginaActual: page,
      administradores: rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener administradores" });
  }
};

const verificarLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await buscarAdminPorEmailDB(email);

    if (!admin) {
      return res.status(404).json({ error: "Administrador no encontrado" });
    }

    const esValida = bcrypt.compareSync(password, admin.password);
    if (!esValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({ mensaje: "Login exitoso", admin: { email: admin.email } });
  } catch (error) {
    res.status(500).json({ error: "Error al verificar login" });
  }
};

module.exports = { crearAdministrador, getAdministradores, verificarLogin };
