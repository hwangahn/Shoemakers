const { shoe } = require('../models/shoe');
const { inventory } = require('../models/inventory');
const { review } = require('../models/review');
const { user } = require('../models/user');
const { order } = require('../models/order')
const { orderDetail } = require('../models/orderDetail');
const { Op } = require('sequelize');

let getShoeByGender = async (req, res) => {

    shoe.findAll({
        where: {
            gender: {
                [Op.eq]: req.params.gender
            }
        },
    })
    .then((shoes) => {
        res.status(200).json({ shoes: shoes});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ shoes: [] });
    });

};

let getShoeById = async (req, res) => {

    shoe.findOne({
        where: {
            sid: {
                [Op.eq]: req.params.sid
            }
        },

        include: [
            { model: inventory }, 
            { 
                model: review, 
                include: { model: user }
            }
        ]
    })
    .then((shoe) => {

        let size = [];
        let review = [];

        shoe.inventories.forEach(element => {

            if (element.qtyInStock != 0) {
                size.push({ iid: element.iid, size: element.size});
            }
        });

        shoe.reviews.forEach(element => {
            review.push({ review: element.review, username: element.user.username });
        });

        let detail = {
            name: shoe.name, 
            gender: shoe.gender, 
            imageURL: shoe.imageURL,
            price: shoe.price
        }

        res.status(200).json({ shoe: detail, review: review, size: size, msg: "" });

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({msg: err});
    });

};

let getShoeByName = async (req, res) => {

    shoe.findAll({
        where: {
            name: {
                [Op.iLike]: `%${req.params.name}%`
            }
        }
    })
    .then((shoes) => {
        res.status(200).json({ msg: "OK", shoes: shoes });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "Oops! Server side error" });
    });

};

let addReview = async (req, res) => {

    let checkExistingReview = await review.findOne({
        where: {
            [Op.and]: [
                {uid: {[Op.eq]: req.user.uid }},
                {sid: {[Op.eq]: req.params.sid }}
            ]
        }
    });

    if (checkExistingReview) {
        return res.status(409).json({ msg: "You have already reviewed this shoe" });
    } 

    let checkPurchased = await order.findOne({
        where: {
            [Op.and]: [
                { uid: { [Op.eq]: req.user.uid }},
                { status: {[Op.eq]: "shipped" }}
            ]
        }, 
        include: {
            model: inventory,
            where: {
                sid: { [Op.eq]: req.params.sid}
            }
        }
    });

    if (checkPurchased) {
        let theReview = await review.create({
            uid: req.user.uid,
            sid: req.params.sid,
            review: req.body.review
        });

        return res.status(200).json({ msg: "OK", review: { review: theReview.review, username: req.user.username }});
    } else {
        return res.status(405).json({ msg: "You need to buy the shoe before reviewing" });
    }

}

module.exports = {
    getShoeByGender,
    getShoeById,
    getShoeByName, 
    addReview
};