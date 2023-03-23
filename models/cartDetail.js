const { Sequelize, DataTypes } = require('sequelize');

const connection = new Sequelize('test', 'newuser', 'hoanganh.012', {
    host: 'localhost',
    dialect: 'mysql'
});

let cartDetail = connection.define('cartDetail', {

    cid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    sid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    tableName: "cartDetail",
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = {
    cartDetail
};