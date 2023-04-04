const { Sequelize, DataTypes } = require('sequelize');

let options = ["mysql://newuser:hoanganh.012@localhost/dev", 
            "postgres://hoang:mGnhdfZEcn6Gv4bXVCosunza2G2eAQHs@dpg-cg70b1d269v5l67opue0-a.singapore-postgres.render.com:5432/test_ffwb?ssl=true"];

const connection = new Sequelize(options[1]);

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