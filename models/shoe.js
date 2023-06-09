const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

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