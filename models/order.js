const { Sequelize, DataTypes } = require('sequelize');

let options = ["mysql://newuser:hoanganh.012@localhost/dev", 
            "postgres://hoang:mGnhdfZEcn6Gv4bXVCosunza2G2eAQHs@dpg-cg70b1d269v5l67opue0-a.singapore-postgres.render.com:5432/test_ffwb?ssl=true"];

const connection = new Sequelize(options[0]);

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