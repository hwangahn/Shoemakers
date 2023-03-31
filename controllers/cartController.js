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

        // get inventory id
        let getOrderDetails = await orderDetail.findAll({
            where: {
                oid: {
                    [Op.eq]: getOrder[0].oid
                }
            },
            include: {
                model: inventory,
                include: shoe
            }
        });

        let toSend = [];
        let total = 0;

        // normalize response and calculating total cost
        getOrderDetails.forEach(Element => {
            toSend.push({
                iid: Element.iid,
                sid: Element.inventory.shoe.sid,
                name: Element.inventory.shoe.name,
                imageURL: Element.inventory.shoe.imageURL,
                gender: Element.inventory.shoe.gender,
                price: Element.inventory.shoe.price,
                size: Element.inventory.size,
                qty: Element.qty
            });
        });

        // renders the order view with items in order
        res.status(200).render('cart', {shoeInCart: toSend, 
                                        total: total,
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

        // get inventory id
        let getInventory = await inventory.findOne({
            where: {
                [Op.and]: [
                    { sid: { [Op.eq]: req.body.sid }},
                    { size: { [Op.eq]: req.body.size }}
                ]
            }
        });

        console.log(getInventory);

        // check whether order has specific item or not
        // if not add one
        let getOrderDetail = await orderDetail.findOrCreate({
            where: {
                [Op.and]: [
                    { oid: { [Op.eq]: getOrder[0].oid }},
                    { iid: { [Op.eq]: getInventory.iid }}
                ]
            },
            defaults: {
                oid: getOrder[0].oid,
                iid: getInventory.iid,
                qty: 0
            }
        });

        // check whether ordered quantity exceeds quantity in stock
        if (getOrderDetail[0].qty + 1 > getInventory.qtyInStock) {
            
            // destroy newly created order (qty = 0)
            orderDetail.destroy({
                where: {
                    qty: { [Op.eq]: 0 }
                }
            })
            .then(() => {
                res.send("Out of stock");
            });

            return;

        }

        // increase quantity of specific item 
        let updateOrder = await getOrderDetail[0].increment({ qty: 1 });

        updateOrder;

        // sends back the "ok" status 
        res.send("Ok");

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

        // get inventory id
        let getInventory = await inventory.findOne({
            where: {
                iid: { [Op.eq]: req.body.iid }
            }
        });

        // check quantity in stock
        if (getInventory.qtyInStock < req.body.qty) {

            // out of stock
            res.send({msg: "Out of stock"});
            return;
        }

        // update quantity of item
        let updateOrder = await orderDetail.update({
            qty: req.body.qty
        }, {
            where: {
                [Op.and]: [
                    { oid: { [Op.eq]: getOrder.oid }},
                    { iid: { [Op.eq]: getInventory.iid }}
                ]
            }
        });

        updateOrder;

        // get order detail
        let getOrderDetails = await orderDetail.findAll({
            where: {
                oid: {
                    [Op.eq]: getOrder.oid
                }
            },
            include: {
                model: inventory,
                include: shoe
            }
        });

        // update total cost
        let total = 0;

        getOrderDetails.forEach(Element => {

            total += (Element.inventory.shoe.price * Element.qty);

        });

        res.send({msg: "ok", newTotal: total});

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
        let updateOrder = await orderDetail.destroy({
            where: {
                [Op.and]: [
                    { oid: { [Op.eq]: getOrder.oid }},
                    { iid: { [Op.eq]: req.body.iid }}
                ]
            }
        });

        updateOrder;

        // get order detail
        let getOrderDetails = await orderDetail.findAll({
            where: {
                oid: {
                    [Op.eq]: getOrder.oid
                }
            },
            include: {
                model: inventory,
                include: shoe
            }
        });

        // update total cost
        let total = 0;

        getOrderDetails.forEach(Element => {

            total += (Element.inventory.shoe.price * Element.qty);

        });

        // confirms update success and send back id of div to remove
        res.send({divId: `#tag-${req.body.iid}`, newTotal: total});

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