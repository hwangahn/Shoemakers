const { orderDetail } = require('../models/orderDetail');
const { order } = require('../models/order');
const { shoe } = require('../models/shoe');
const { inventory } = require('../models/inventory');
const { Op } = require('sequelize');

let getOrderDetails = async (req) => {
    try {
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
        
        let shoeList = [];
        let msg = [];

        // normalize response and calculating total cost
        getOrderDetails.forEach((Element) => {

            // verify quantity in stock is sufficient or quantity is illegal (eg. <0)
            if (Element.inventory.qtyInStock < Element.qty || Element.qty <= 0) {

                // if there are none left, remove item from cart and set msg telling user that the cart has changed
                msg.push(`${Element.inventory.shoe.gender}'s ${Element.inventory.shoe.name} Size ${Element.inventory.size} has been removed due to insufficient stock`);
                Element.destroy();
            } else {

                // add shoe to list
                shoeList.push({
                    iid: Element.iid,
                    sid: Element.inventory.shoe.sid,
                    name: Element.inventory.shoe.name,
                    imageURL: Element.inventory.shoe.imageURL,
                    gender: Element.inventory.shoe.gender,
                    price: Element.inventory.shoe.price,
                    size: Element.inventory.size,
                    qty: Element.qty
                });
            }
        });

        return ({shoes: shoeList, msg: msg});

    } catch(err) {
        console.log(err);
    }
}

let getUsersOrder = async (req, res) => {

    let orderDetails = await getOrderDetails(req);

    // renders the order view with items in order
    res.status(200).json(orderDetails);
};

let alterOrder = async (req, res) => {

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
                    { iid: { [Op.eq]: req.body.iid }}
                ]
            },
            defaults: {
                oid: getOrder[0].oid,
                iid: req.body.iid,
                qty: 0
            }
        });
        
        // get inventory id
        let getInventory = await inventory.findOne({
            where: {
                [Op.and]: [
                    { iid: { [Op.eq]: req.body.iid }}
                ]
            }
        });

        // check whether ordered quantity exceeds quantity in stock
        if (getOrderDetail[0].qty + req.body.qty > getInventory.qtyInStock ||
            getOrderDetail[0].qty + req.body.qty <= 0) {
            
            // destroy newly created order (if qty = 0)
            if (getOrderDetail[0].qty == 0) {
                getOrderDetail[0].destroy();
            }


            res.status(406).json({ qty: getOrderDetail[0].qty, msg: "Insufficient stock" });
            
        } else {

            // increase quantity of specific item 
            getOrderDetail[0].increment({ qty: req.body.qty });

            // sends back the "ok" status 
            res.status(200).json({ msg: "OK" });

        }

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

        res.status(200).json({ msg: "OK" });

    } catch(err) {

        // catch all errors
        console.log(err);
        res.status(500);
    }

};

let checkout = async (req, res) => {

    let { shoes, msg } = await getOrderDetails(req);

    if (!msg.length) {
        console.log("here");
        shoes.forEach( async (Element) => {
            let getInventory = await inventory.findOne({
                where: {
                    iid: {
                        [Op.eq]: Element.iid
                    }
                }
            })

            getInventory.decrement( {qtyInStock: Element.qty });
        });

        let getOrder = await order.findOne({
            where: {
                [Op.and]: [
                    { uid: {[Op.eq]: req.user.uid }},
                    { status: {[Op.eq] : "active" }}
                ]
            }
        });

        getOrder.update({ status: "shipped" });

        res.status(200).json({ oid: getOrder.oid, msg: "OK" });
    } else {
        res.status(406).json({ shoes: shoes, msg: msg });
    }
}

module.exports = { 
    getUsersOrder, 
    alterOrder, 
    deleteItemFromOrder, 
    checkout
};