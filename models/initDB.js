const { user } = require('./user');
const { cart } = require('./cart');
const { shoe } = require('./goods');
const { cartDetail } = require('./cartDetail');

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


