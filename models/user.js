const { Sequelize, DataTypes } = require('sequelize');

const connection = new Sequelize('dev', 'newuser', 'hoanganh.012', {
    host: 'localhost',
    dialect: 'mysql'
});

let user = connection.define('user', {

    uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    phone: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    address: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    tableName: "user",
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = { user };