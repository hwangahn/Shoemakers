const { orderDetail } = require('../models/orderDetail');
const { order } = require('../models/order');
const { shoe } = require('../models/shoe');
const { inventory } = require('../models/inventory');
const { Op } = require('sequelize');


let getUsersOrder = async (req, res) => {

    if (!req.isAuthenticated()) {

        // relocate to login page, since guest cannot but stuff
        res.redirect('/login'); 
        return;
    } 

    try {

        // check whether user has active order or not
        // if not create one
        let getOrder = await order.findOrCreate({
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

        // find products and quantity of products in the order
        let getOrderDetails = await  orderDetail.findAll({
            where: {
                oid: {
                    [Op.eq]: getOrder[0].oid
                }
            },
            include: shoe
        });

        // renders the order view with items in order
        res.status(200).render('cart', {shoeInCart: getOrderDetails, 
                                        authenticated: req.isAuthenticated()});

    } catch(err) {

        // catch errors
        console.log(err);
        res.status(500);
    }

};

let addToOrder = async (req, res) => {

    if (!req.isAuthenticated()) {

        // sends a messege back to jquery telling that the user is browsing as a guest, and guest cannot but stuff
        res.send("Needs to log in"); 
        return;
    }

    try {

        // check whether user has active order or not
        // if not create one
        let getOrder = await order.findOrCreate({
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

        // check whether order has specific item or not
        // if not add one
        let getOrderDetail = await orderDetail.findOrCreate({
            where: {
                [Op.and]: [
                    { oid: { [Op.eq]: getOrder[0].oid }},
                    { sid: { [Op.eq]: req.body.sid }},
                    { size: { [Op.eq]: req.body.size }}
                ]
            },
            defaults: {
                oid: getOrder[0].oid,
                sid: req.body.sid,
                size: req.body.size,
                qty: 0
            }
        });

        // increase quantity of specific item 
        let updateOrder = getOrderDetail[0].increment({ qty: 1 });

        updateOrder;

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

        // get user's active order
        let getOrder = await order.findOne({
            where: {
                [Op.and]: [
                    { uid: { [Op.eq]: req.user.uid }},
                    { status: { [Op.eq]: "active" }}
                ]
            }
        });

        let getInventory = await inventory.findOne({
            where: {
                [Op.and]: [
                    { sid: { [Op.eq]: req.body.sid }},
                    { size: {[Op.eq]: req.body.size }}
                ]
            }
        });

        // check quantity in stock
        if (getInventory.qtyInStock < req.body.qty) {

            // out of stock
            res.status(300).send("Out of stock");
        }

        // update quantity of item
        let updateOrder = await orderDetail.update({
            qty: req.body.qty
        }, {
            where: {
                [Op.and]: [
                    { oid: { [Op.eq]: getOrder.oid }},
                    { sid: { [Op.eq]: req.body.sid }},
                    { size: {[Op.eq]: req.body.size }}
                ]
            }
        });

        updateOrder;

        res.status(200).send("ok");

    } catch(err) { 
    
        // catch all errors 
        console.log(err);
        res.status(500);
    } 

};

let deleteItemFromOrder = async (req, res) => {

    try {
        // get user's active order
        let getOrder = await order.findOne({
            where: {
                [Op.and]: [
                    { uid: { [Op.eq]: req.user.uid }},
                    { status: { [Op.eq]: "active" }}
                ]
            }
        });

        // remove specific item from order
        let updateOrder = orderDetail.destroy({
            where: {
                [Op.and]: [
                    { oid: { [Op.eq]: getOrder.oid }},
                    { sid: { [Op.eq]: req.body.sid }},
                    { size: {[Op.eq]: req.body.size }}
                ]
            }
        });

        updateOrder;

        // confirms update success and send back id of div to remove
        res.status(200).send(`#tag-${req.body.sid}_${req.body.size}`);
    } catch(err) {

        // catch all errors
        console.log(err);
        res.status(500);
    }

};

module.exports = { 
    getUsersOrder, 
    addToOrder, 
    updateQty, 
    deleteItemFromOrder 
};