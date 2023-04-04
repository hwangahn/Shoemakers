const { user } = require('./user');
const { order } = require('./order');
const { shoe } = require('./shoe');
const { orderDetail } = require('./orderDetail');
const { Sequelize } = require('sequelize');
const { inventory } = require('./inventory');
const { review } = require('./review');

let options = ["mysql://newuser:hoanganh.012@localhost/dev", 
            "postgres://hoang:mGnhdfZEcn6Gv4bXVCosunza2G2eAQHs@dpg-cg70b1d269v5l67opue0-a.singapore-postgres.render.com:5432/test_ffwb?ssl=true"];

const connection = new Sequelize(options[0]);

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
.catch((err) => {
    console.log(err);
});

