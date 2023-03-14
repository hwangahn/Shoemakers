const { Sequelize, DataTypes } = require('sequelize');

const connection = new Sequelize('test', 'newuser', 'hoanganh.012', {
    host: 'localhost',
    dialect: 'mysql'
});

let user = connection.define('users', {

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
    }

}, {
    tableName: "users",
    timestamps: false,
    createdAt: false,
    updatedAt: false
})

module.exports = { user };