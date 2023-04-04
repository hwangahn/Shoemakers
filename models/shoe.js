const { Sequelize, DataTypes } = require('sequelize');

let options = ["mysql://newuser:hoanganh.012@localhost/dev", 
            "postgres://hoang:mGnhdfZEcn6Gv4bXVCosunza2G2eAQHs@dpg-cg70b1d269v5l67opue0-a.singapore-postgres.render.com:5432/test_ffwb?ssl=true"];

const connection = new Sequelize(options[1]);

let shoe = connection.define('shoe', {

    sid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },

    imageURL: {
        type: DataTypes.STRING
    },

    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    tableName: "shoe",
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = { shoe };