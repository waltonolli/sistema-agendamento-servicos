const { Sequelize } = require('sequelize');
const path = require('path');

const dbDialect = process.env.DB_DIALECT || 'sqlite';
const dbStorage = process.env.DB_STORAGE || path.join(__dirname, '..', 'data', 'agenda.sqlite');

const sequelizeOptions = {
  dialect: dbDialect,
  logging: false,
};

if (dbDialect === 'sqlite') {
  sequelizeOptions.storage = dbStorage;
} else {
  sequelizeOptions.host = process.env.DB_HOST || 'localhost';
  sequelizeOptions.port = process.env.DB_PORT || 3306;
  sequelizeOptions.username = process.env.DB_USER || 'root';
  sequelizeOptions.password = process.env.DB_PASS || 'senha';
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'agenda_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'senha',
  sequelizeOptions
);

sequelize.authenticate()
  .then(() => console.log('Conexão com o banco de dados estabelecida!'))
  .catch(err => console.error('Erro ao conectar:', err));

module.exports = sequelize;
