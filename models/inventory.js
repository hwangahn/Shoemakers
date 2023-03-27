const { Sequelize, DataTypes } = require('sequelize');

let options = ["mysql://newuser:hoanganh.012@localhost/dev", 
            "postgres://hoang:mGnhdfZEcn6Gv4bXVCosunza2G2eAQHs@dpg-cg70b1d269v5l67opue0-a.singapore-postgres.render.com:5432/test_ffwb?ssl=true"];

const connection = new Sequelize(options[1]);

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