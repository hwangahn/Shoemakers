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

order.belongsToMany(shoe, {
    through: 'orderDetail',
    foreignKey: 'oid'
});
shoe.belongsToMany(order, {
    through: 'orderDetail',
    foreignKey: 'sid'
});

orderDetail.belongsTo(order, {
    foreignKey: 'oid'
});
order.hasMany(orderDetail, {
    foreignKey: 'oid'
});

orderDetail.belongsTo(shoe, {
    foreignKey: 'sid'
});
shoe.hasMany(orderDetail, {
    foreignKey: 'sid'
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

