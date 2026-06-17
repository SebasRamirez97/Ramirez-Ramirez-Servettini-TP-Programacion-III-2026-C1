const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Módulo para manejar carpetas

const imgMiddlewares = multer({
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },

  fileFilter: (req, file, callback) => {
    const tiposPermitidos = ["png", "jpg", "jpeg"];
    const categoria = file.mimetype.split("/")[1];

    if (tiposPermitidos.includes(categoria)) {
      callback(null, true);
    } else {
      callback(new Error("El archivo no es una imagen permitida"), false);
    }
  },

  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      let carpeta;
      
      // Lógica simple con if/else
      if (req.body.categoria === 'vehiculos') {
        carpeta = 'img-vehiculos';
      } else {
        carpeta = 'img-powerups';
      }

      // Construimos la ruta absoluta
      const rutaDestino = path.join(__dirname, "../../resources", carpeta);

      // Si la carpeta NO existe, la creamos antes de guardar la foto
      if (!fs.existsSync(rutaDestino)) {
        fs.mkdirSync(rutaDestino, { recursive: true });
      }

      callback(null, rutaDestino);
    },
    
    filename: (req, file, callback) => {
      // Nombre único con fecha actual
      callback(null, `IMG-${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
});

module.exports = imgMiddlewares;