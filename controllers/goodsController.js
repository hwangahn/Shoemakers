const { shoe } = require('../models/shoe');
const { inventory } = require('../models/inventory');
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
        res.status(200).json({ shoes: shoes, msg: ""});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ shoes: [], msg: "Oops! Server side error" });
    });

};

let getShoeById = async (req, res) => {

    console.log(req.body)

    shoe.findOne({
        where: {
            sid: {
                [Op.eq]: req.params.sid
            }
        },

        include: {
            model: inventory
        }
    })
    .then((shoe) => {

        let size = [];

        shoe.inventories.forEach(element => {
            if (element.qty != 0) {
                size.push(element.size);
            }
        });

        res.status(200).json({ shoe: shoe, size: size, msg: "" });

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
                [Op.like]: `%${req.body.name}%`
            }
        }
    })
    .then((shoes) => {
        res.status(200).render('goods', {shoes: shoes,
                                        authenticated: req.isAuthenticated()});
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Oops! Server side error");
    });

};

module.exports = {
    getShoeByGender,
    getShoeById,
    getShoeByName
};