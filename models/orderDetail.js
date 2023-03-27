const { Sequelize, DataTypes } = require('sequelize');

// const connection = new Sequelize('dev', 'newuser', 'hoanganh.012', {
//     host: 'localhost',
//     dialect: 'mysql'
// });

const connection = new Sequelize("postgres://hoang:mGnhdfZEcn6Gv4bXVCosunza2G2eAQHs@dpg-cg70b1d269v5l67opue0-a.singapore-postgres.render.com:5432/test_ffwb?ssl=true", {
    pool: {
        max: 15,
        min: 5,
        idle: 20000,
        evict: 15000,
        acquire: 30000      
    }
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