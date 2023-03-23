const { cartDetail } = require('../models/cartDetail');
const { cart } = require('../models/cart');
const { shoe } = require('../models/goods');
const { Op } = require('sequelize');


let getUsersCart = async (req, res) => {

    if (!req.isAuthenticated()) {

        // relocate to login page, since guest cannot but stuff
        res.redirect('/login'); 
        return;
    } 

    try {

        // check whether user has active cart or not
        // if not create one
        let getCart = await cart.findOrCreate({
            where: {
                [Op.and]: [
                    { uid: { [Op.eq]: req.user.uid }},
                    { status: { [Op.eq]: "active" }}
                ]
            },
            defaults: {
                uid: req.user.uid,
                status: "active"
            },
        });

        // find products and quantity of products in the cart
        let getCartDetails = await  cartDetail.findAll({
            where: {
                cid: {
                    [Op.eq]: getCart[0].cid
                }
            },
            include: shoe,
        });

        // renders the cart view with items in cart
        res.status(200).render('cart', {shoeInCart: getCartDetails, 
                                        authenticated: req.isAuthenticated()});

    } catch(err) {

        // catch errors
        console.log(err);
        res.status(500);
    }

};

let addToCart = async (req, res) => {

    if (!req.isAuthenticated()) {

        // sends a messege back to jquery telling that the user is browsing as a guest, and guest cannot but stuff
        res.send("Needs to log in"); 
        return;
    }

    try {

        // check whether user has active cart or not
        // if not create one
        let getCart = await cart.findOrCreate({
            where: {
                [Op.and]: [
                    { uid: { [Op.eq]: req.user.uid }},
                    { status: { [Op.eq]: "active" }}
                ]
            },
            defaults: {
                uid: req.user.uid,
                status: "active"
            }
        });

        // check whether cart has specific item or not
        // if not add one
        let getCartDetail = await cartDetail.findOrCreate({
            where: {
                [Op.and]: [
                    { cid: { [Op.eq]: getCart[0].cid }},
                    { sid: { [Op.eq]: req.body.sid }}
                ]
            },
            defaults: {
                cid: getCart[0].cid,
                sid: req.body.sid,
                qty: 0
            }
        });

        // increase quantity of specific item 
        let updateCart = getCartDetail[0].increment({ qty: 1 });

        updateCart;

        // sends back the "ok" status 
        res.status(200).send("Ok");

    } catch(err) {
            
        // catch all errors
        console.log(err);
        res.status(500);
    }

};

let updateQty = async (req, res) => {

    try {

        // get user's active cart
        let getCart = await cart.findOne({
            where: {
                [Op.and]: [
                    { uid: { [Op.eq]: req.user.uid }},
                    { status: { [Op.eq]: "active" }}
                ]
            }
        });

        // update quantity of item
        let updateCart = await cartDetail.update({
            qty: req.body.qty
        }, {
            where: {
                [Op.and]: [
                    {cid: { [Op.eq]: getCart.cid }},
                    {sid: { [Op.eq]: req.body.sid }}
                ]
            }
        });

        updateCart;

        res.status(200).send("Done");

    } catch(err) { 
    
        // catch all errors 
        console.log(err);
        res.status(500);
    } 

};

let deleteItemFromCart = async (req, res) => {

    try {
        // get user's active cart
        let getCart = await cart.findOne({
            where: {
                [Op.and]: [
                    { uid: { [Op.eq]: req.user.uid }},
                    { status: { [Op.eq]: "active" }}
                ]
            }
        });

        // remove specific item from cart
        let updateCart = cartDetail.destroy({
            where: {
                [Op.and]: [
                    {cid: { [Op.eq]: getCart.cid }},
                    {sid: { [Op.eq]: req.body.sid }}
                ]
            }
        });

        updateCart;

        // confirms update success and send back id of div to remove
        res.status(200).send(`#${req.body.sid}`);
    } catch(err) {

        // catch all errors
        console.log(err);
        res.status(500);
    }

};

module.exports = { 
    getUsersCart, 
    addToCart, 
    updateQty, 
    deleteItemFromCart 
};