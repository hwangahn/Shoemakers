const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

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