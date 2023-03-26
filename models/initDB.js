const { user } = require('./user');
const { order } = require('./order');
const { shoe } = require('./shoe');
const { orderDetail } = require('./orderDetail');
const { Sequelize } = require('sequelize');
const { inventory } = require('./inventory');

const connection = new Sequelize('dev', 'newuser', 'hoanganh.012', {
    host: 'localhost',
    dialect: 'mysql'
});

connection.authenticate()
.then(() => {
    console.log("Connected to database");
})
.catch((err) => {
    console.log(err);
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

