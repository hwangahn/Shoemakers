const { Sequelize, DataTypes } = require('sequelize');

const connection = new Sequelize('dev', 'newuser', 'hoanganh.012', {
    host: 'localhost',
    dialect: 'mysql'
});

let inventory = connection.define('inventory', {

    iid: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    }, 

    sid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    qtyInStock: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    tableName: "inventory",
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = { inventory };