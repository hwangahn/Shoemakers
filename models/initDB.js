const { Sequelize } = require('sequelize');
const { user } = require('./user');
const { order } = require('./order');
const { shoe } = require('./shoe');
const { orderDetail } = require('./orderDetail');
const { inventory } = require('./inventory');
const { review } = require('./review');
const { payment } = require('./payment');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_KEY);

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

user.belongsToMany(shoe, {
    through: 'review',
    foreignKey: 'uid'
});
shoe.belongsToMany(user, {
    through: 'review',
    foreignKey: 'uid'
});

review.belongsTo(user, {
    foreignKey: 'uid'
});
user.hasMany(review, {
    foreignKey: 'uid'
});

review.belongsTo(shoe, {
    foreignKey: 'sid'
});
shoe.hasMany(review, {
    foreignKey: 'sid'
});

order.hasOne(payment, {
    foreignKey: 'oid'
});
payment.belongsTo(order, {
    foreignKey: 'oid'
});

user.sync()
.then(() => {
    return order.sync();
})
.then(() => {
    return shoe.sync();
})
.then(() => {
    return inventory.sync();
})
.then(() => {
    return orderDetail.sync();
})
.then(() => {
    return review.sync();
})
.then(() => {
    return payment.sync();
})
.catch((err) => {
    console.log(err);
});

