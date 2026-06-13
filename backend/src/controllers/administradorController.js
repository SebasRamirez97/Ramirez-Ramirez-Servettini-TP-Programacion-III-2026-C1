const bcrypt = require("bcrypt");
const {Administrador} = requiere("..models/index");

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

    res.json({mensaje: "Login exitoso" , admin:{emali: admin.email}});
}