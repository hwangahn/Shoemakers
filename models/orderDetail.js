const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let orderDetail = connection.define('orderDetail', {

    oid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    iid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    tableName: "orderDetail",
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = {
    orderDetail
};