const { shoe } = require('../models/goods');
const { Op } = require('sequelize');

let getShoeByCategory = async (req, res) => {

    shoe.findAll({
        where: {
            category: {
                [Op.eq]: req.params.category
            }
        },
    })
    .then((shoes) => {
        res.status(200).render('goods', {shoes: shoes,
                                        category: req.params.category,
                                        authenticated: req.isAuthenticated()});
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Oops! Server side error");
    });

};

let getShoeById = async (req, res) => {

    shoe.findAll({
        where: {
            sid: {
                [Op.eq]: req.params.sid
            }
        }
    })
    .then((shoe) => {

        res.status(200).render('shoe', {shoe: shoe[0], 
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
    getShoeByCategory,
    getShoeById,
    getShoeByName
};