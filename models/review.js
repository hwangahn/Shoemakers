const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

let review = connection.define('review', {

    uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    sid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    review: {
        type: DataTypes.TEXT,
        allowNull: false
    }

}, {
    tableName: "review",
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports = {
    review
};