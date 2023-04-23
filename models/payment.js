const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let payment = connection.define('payment', {

    oid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },

    type: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    tableName: "payment",
    updatedAt: false
});

module.exports = { payment };