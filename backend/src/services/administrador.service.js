const bcrypt = require("bcrypt");
const { Administrador } = require("../models/index");

const crearAdministradorDB = async (email, password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return await Administrador.create({ email, password: hashedPassword });
};

const getAdministradoresDB = async (page, limit) => {
  const offset = (page - 1) * limit;
  return await Administrador.findAndCountAll({ limit, offset });
};

const buscarAdminPorEmailDB = async (email) => {
  return await Administrador.findOne({ where: { email } });
};

module.exports = {
  crearAdministradorDB,
  getAdministradoresDB,
  buscarAdminPorEmailDB,
};