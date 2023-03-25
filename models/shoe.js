const { Sequelize, DataTypes } = require('sequelize');

const connection = new Sequelize('dev', 'newuser', 'hoanganh.012', {
    host: 'localhost',
    dialect: 'mysql'
});

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

    description: {
        type: DataTypes.STRING,
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