const bcrypt = require("bcrypt");
const { Administrador, Producto } = require('../models/index');

const crearAdministradorDB = async (email, password) => {
    // La lógica de negocio (hashear la contraseña) se resuelve en el servicio
    const hashedPassword = bcrypt.hashSync(password, 10);
    return await Administrador.create({
        email,
        password: hashedPassword
    });
};

const buscarAdministradoresDB = async (limit, offset) => {
    return await Administrador.findAndCountAll({
        limit,
        offset
    });
};

const buscarAdminPorEmailDB = async (email) => {
    return await Administrador.findOne({ where: { email } });
};

const buscarProductosDashboardDB = async () => {
    // El dashboard necesita los productos ordenados de forma ascendente
    return await Producto.findAll({ order: [['id', 'ASC']] });
};

module.exports = {
    crearAdministradorDB,
    buscarAdministradoresDB,
    buscarAdminPorEmailDB,
    buscarProductosDashboardDB
};