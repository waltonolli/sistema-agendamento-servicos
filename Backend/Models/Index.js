const { Sequelize } = require('sequelize');
const path = require('path');

const dbDialect = process.env.DB_DIALECT || 'sqlite';

const sequelizeOptions = {
  dialect: dbDialect,
  logging: false,
};

if (dbDialect === 'sqlite') {
  sequelizeOptions.storage = process.env.DB_STORAGE || 
    path.join(__dirname, '..', 'data', 'agenda.sqlite');
} else {
  sequelizeOptions.host = process.env.DB_HOST;
  sequelizeOptions.port = process.env.DB_PORT;
  sequelizeOptions.username = process.env.DB_USER;
  sequelizeOptions.password = process.env.DB_PASS;
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'agenda_db',
  process.env.DB_USER,
  process.env.DB_PASS,
  sequelizeOptions
);

sequelize.authenticate()
  .then(() => console.log('Conexão com o banco de dados estabelecida!'))
  .catch(err => console.error('Erro ao conectar:', err));

module.exports = sequelize;
