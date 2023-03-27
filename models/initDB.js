const { user } = require('./user');
const { order } = require('./order');
const { shoe } = require('./shoe');
const { orderDetail } = require('./orderDetail');
const { Sequelize } = require('sequelize');
const { inventory } = require('./inventory');

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

connection.authenticate()
.then(() => {
    console.log("Connected");
});

user.hasMany(order, {
    foreignKey: 'uid'
});
order.belongsTo(user, {
    foreignKey: 'uid'
});

order.belongsToMany(inventory, {
    through: 'orderDetail',
    foreignKey: 'oid'
});
inventory.belongsToMany(order, {
    through: 'orderDetail',
    foreignKey: 'iid'
});

orderDetail.belongsTo(order, {
    foreignKey: 'oid'
});
order.hasMany(orderDetail, {
    foreignKey: 'oid'
});

orderDetail.belongsTo(inventory, {
    foreignKey: 'iid'
});
inventory.hasMany(orderDetail, {
    foreignKey: 'iid'
});

shoe.hasMany(inventory, {
    foreignKey: 'sid'
});
inventory.belongsTo(shoe, {
    foreignKey: 'sid'
});


user.sync().then(() => {
    order.sync().then(() => {
        shoe.sync().then(() => {
            inventory.sync().then(() => {
                orderDetail.sync();
            });
        });
    });
});

