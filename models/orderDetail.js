const { Sequelize, DataTypes } = require('sequelize');

const connection = new Sequelize('dev', 'newuser', 'hoanganh.012', {
    host: 'localhost',
    dialect: 'mysql'
});

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