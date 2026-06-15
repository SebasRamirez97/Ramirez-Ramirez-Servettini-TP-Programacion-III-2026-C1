const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Conexión a MySQL establecida correctamente');
  })
  .catch((error) => {
    console.error('❌ Error al conectar con MySQL:', error.message);
  });

module.exports = sequelize;