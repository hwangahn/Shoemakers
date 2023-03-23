const { user } = require('./user');
const { cart } = require('./cart');
const { shoe } = require('./goods');
const { cartDetail } = require('./cartDetail');
const { Sequelize } = require('sequelize');

const connection = new Sequelize('test', 'newuser', 'hoanganh.012', {
    host: 'localhost',
    dialect: 'mysql'
});

connection.authenticate()
.then(() => {
    console.log("Connected to database");
})
.catch((err) => {
    console.log(err);
})

user.hasMany(cart, {
    foreignKey: 'uid'
});
cart.belongsTo(user, {
    foreignKey: 'uid'
});

cart.belongsToMany(shoe, {
    through: 'cartDetail',
    foreignKey: 'cid'
});
shoe.belongsToMany(cart, {
    through: 'cartDetail',
    foreignKey: 'sid'
});

cartDetail.belongsTo(cart, {
    foreignKey: 'cid'
});
cart.hasMany(cartDetail, {
    foreignKey: 'cid'
});

cartDetail.belongsTo(shoe, {
    foreignKey: 'sid'
});
shoe.hasMany(cartDetail, {
    foreignKey: 'sid'
});


user.sync().then(() => {
    console.log("User table sync successfully");
    cart.sync().then(() => {
        console.log("Cart table sync successfully");
        shoe.sync().then(() => {
            console.log("Shoe table sync successfully");
            cartDetail.sync().then(() => {
                console.log("CardDetail table sync successfully");
            });
        });
    });
});


