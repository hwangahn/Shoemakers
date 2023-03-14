var session = require('express-session');
var Sequelize = require('sequelize');
var SequelizeStore = require('connect-session-sequelize')(session.Store);

const db = new Sequelize('test', 'newuser', 'hoanganh.012', {
    host: 'localhost',
    dialect: 'mysql'
});

var sessionStore = new SequelizeStore({
   db: db,
   checkExpirationInterval: 15 * 60 * 1000,
   expiration: 7 * 24 * 60 * 60 * 1000
});

sessionStore.sync();

module.exports = { sessionStore };