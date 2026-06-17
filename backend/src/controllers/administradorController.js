const { where } = require('sequelize');
const bcrypt = require("bcrypt");
const {Administrador } = require('../models/index');


const crearAdministrador = async  (req, res) => {
    try{
        const {email , password} = req.body;

        const hashedPassword = bcrypt.hashSync(password, 10);

        const nuevoAdmin = await Administrador.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({mensaje: "Administrador creado", admin: nuevoAdmin})

    } catch (error){
        res.status(500).json({error: error.message})
    }
}

const getAdministradores = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const offset = (page - 1) * limit;

        const { count, rows } = await Administrador.findAndCountAll({
            limit,
            offset
        });

        res.json({
            total: count,
            paginas: Math.ceil(count / limit),
            paginaActual: page,
            administradores: rows
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener administradores' });
    }
};

const verificarLogin = async(req, res) => {
    const {email, password} = req.body;

    const admin = await Administrador.findOne({where: {email } });
    if(!admin){
        return res.status(404).json({error: "Administrador no encontrado"});
    }

    const esValida = bcrypt.compareSync(password, admin.password);
    if(!esValida){
        return res.status(401).json({error: "Contraseña incorrecta"});
    }

    res.json({mensaje: "Login exitoso" , admin:{email: admin.email}});
}

module.exports = {crearAdministrador,getAdministradores, verificarLogin}
