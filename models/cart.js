const { Sequelize, DataTypes } = require('sequelize');

const connection = new Sequelize('test', 'newuser', 'hoanganh.012', {
    host: 'localhost',
    dialect: 'mysql'
});

let cart = connection.define('carts', {

    cid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    uid: {
        type: DataTypes.MEDIUMINT,
        allowNull: false
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false
    }    

}, {
    tableName: "carts",
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = { cart };