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
        res.status(200).render('goods', {shoes: shoes,
                                        category: req.params.gender,
                                        authenticated: req.isAuthenticated()});
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Oops! Server side error");
    });

};

let getShoeById = async (req, res) => {

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
            size.push(element.size);
        });

        res.status(200).render('shoe', {shoe: shoe,
                                        size: size, 
                                        authenticated: req.isAuthenticated()});

    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Oops! Server side error");
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