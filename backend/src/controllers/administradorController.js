const bcrypt = require("bcrypt");
const {
    crearAdministradorDB,
    buscarAdministradoresDB,
    buscarAdminPorEmailDB,
    buscarProductosDashboardDB
} = require("../services/administrador.service");

// 1. OPERACIONES DE LA API (RESPUESTAS JSON)

const crearAdministrador = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Le mandamos los datos limpios al servicio
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
        const offset = (page - 1) * limit;

        const { count, rows } = await buscarAdministradoresDB(limit, offset);

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

const verificarLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscamos si el usuario existe usando el servicio
        const admin = await buscarAdminPorEmailDB(email);
        if (!admin) {
            return res.status(404).json({ error: "Administrador no encontrado" });
        }

        // El controlador valida si el password coincide con Express
        const esValida = bcrypt.compareSync(password, admin.password);
        if (!esValida) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        res.json({ mensaje: "Login exitoso", admin: { email: admin.email } });
    } catch (error) {
        res.status(500).json({ error: "Error en el proceso de login" });
    }
};

// 🖥️ 2. OPERACIONES DE RENDERIZADO (VISTAS EJS)

const mostrarLogin = (req, res) => {
    res.render('loginAdmin'); 
};

const mostrarDashboard = async (req, res) => {
    try {
        // El servicio nos trae el array de productos puros
        const listaProductos = await buscarProductosDashboardDB();

        // El controlador los inyecta en la plantilla HTML
        res.render('dashboard', { productos: listaProductos });
    } catch (error) {
        console.error("Error al cargar el dashboard EJS:", error);
        res.status(500).send("Error interno del servidor al cargar el panel.");
    }
};

const mostrarFormularioProducto = (req, res) => {
    res.render('formulario-producto'); 
};

module.exports = {
    crearAdministrador,
    getAdministradores,
    verificarLogin,
    mostrarLogin,
    mostrarDashboard,
    mostrarFormularioProducto
};
