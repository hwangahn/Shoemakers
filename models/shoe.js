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