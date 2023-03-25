const { Sequelize, DataTypes } = require('sequelize');

const connection = new Sequelize('dev', 'newuser', 'hoanganh.012', {
    host: 'localhost',
    dialect: 'mysql'
});

let order = connection.define('order', {

    oid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    uid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false
    }    

}, {
    tableName: "order",
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = { order };