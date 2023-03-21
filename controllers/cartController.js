const { cartDetail } = require('../models/cartDetail');
const { cart } = require('../models/cart');
const { shoe } = require('../models/goods');
const { Op } = require('sequelize');


let getCart = (req, res) => {

    if (!req.isAuthenticated()) {
        res.redirect('/login'); // relocate to login page, since guest cannot but stuff
    } else {

        // check whether user has active cart or not
        // if not create one
        cart.findOrCreate({
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
        })
        .then((theOneCart) => {

            // find products and quantity of products in the cart
            cartDetail.findAll({
                where: {
                    cid: {
                        [Op.eq]: theOneCart[0].cid
                    }
                },
                include: shoe,
            })
            .then((theOneCartDetail) => {

                // renders the cart view with items in cart
                res.status(200).render('cart', {shoeInCart: theOneCartDetail, 
                                                authenticated: req.isAuthenticated()});
            })
            .catch(err => {

                // catch errors while searching for items in cart
                console.log(err);
                res.status(500);
            });

        })
        .catch((err) => {

            // catch errors while searching for cart
            console.log(err);
            res.status(500);
        })
    }

};

let addToCart = (req, res) => {

    if (!req.isAuthenticated()) {
        res.send("Not ok"); // sends a messege back to jquery telling that the user is browsing as a guest, and guest cannot but stuff
    } else {


        // check whether user has active cart or not
        // if not create one
        cart.findOrCreate({
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
        })
        .then((theOneCart) => {

            // checking whether item is in cart
            cartDetail.count({
                where: {
                    [Op.and]: [
                        { cid: { [Op.eq]: theOneCart[0].cid }},
                        { sid: { [Op.eq]: req.body.sid }}
                    ]
                },
            })
            .then((data) => {
                
                if (!data) {

                    // if not, add to cart
                    cartDetail.create({
                        cid: theOneCart[0].cid,
                        sid: req.body.sid,
                        qty: 1
                    })
                    .then(() => {

                        // sends back the "ok" status to jquery
                        res.status(200).send("Ok");
                    })
                    .catch(err => {

                        // catch errors while adding item to cart
                        console.log(err);
                        res.status(500);
                    });

                } else {

                    // else, increse the quantity by 1
                    cartDetail.increment({
                        qty: 1
                    }, {
                        where: {
                            [Op.and]: [
                                { sid: { [Op.eq]: req.body.sid }},
                                { cid: { [Op.eq]: theOneCart[0].cid }}
                            ]
                        }
                    })
                    .then(() => {

                        // sends back the "ok" status to jquery
                        res.status(200).send("Ok");
                    })
                    .catch(err => {

                        // catch errors while incresing quantity
                        console.log(err);
                        res.status(500);
                    });

                }

            })
            .catch(err => {

                // catch errors while checking item in cart
                console.log(err);
                res.status(500);
            });

        })
        .catch((err) => {

            // catch errors while searching for cart
            console.log(err);
            res.status(500);
        });

    }    

};

let updateQty = (req, res) => {

    // get user's active cart
    cart.findOne({
        where: {
            [Op.and]: [
                { uid: { [Op.eq]: req.user.uid }},
                { status: { [Op.eq]: "active" }}
            ]
        }
    })
    .then((theOneCart) => {

        // update quantity of item
        cartDetail.update({
            qty: req.body.qty
        }, {
            where: {
                [Op.and]: [
                    {cid: { [Op.eq]: theOneCart.cid}},
                    {sid: { [Op.eq]: req.body.sid}}
                ]
            }
        })
        .then(() => {

            // confirms update success
            res.status(200).send("Done");
        })
        .catch(err => {

            // catch errors while updating quantity
            console.log(err);
            res.status(500);
        })

    })
    .catch(err => {

        // catch errors while getting cart
        console.log(err);
        res.status(500);
    });
};

let deleteItemFromCart = (req, res) => {

    // get user's active cart
    cart.findOne({
        where: {
            [Op.and]: [
                { uid: { [Op.eq]: req.user.uid }},
                { status: { [Op.eq]: "active" }}
            ]
        }
    })
    .then((theOneCart) => {

        // update quantity of item
        cartDetail.destroy({
            where: {
                [Op.and]: [
                    {cid: { [Op.eq]: theOneCart.cid}},
                    {sid: { [Op.eq]: req.body.sid}}
                ]
            }
        })
        .then(() => {

            // confirms update success and send back id of div to remove
            res.status(200).send(`#${req.body.sid}`);
        })
        .catch(err => {

            // catch errors while updating quantity
            console.log(err);
            res.status(500);
        })

    })
    .catch(err => {

        // catch errors while getting cart
        console.log(err);
        res.status(500);
    });

};

module.exports = { getCart, addToCart, updateQty, deleteItemFromCart };