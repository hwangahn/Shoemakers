const { shoe } = require('../models/goods');
const { Op } = require('sequelize');

let getShoeByCategory = (req, res) => {

    let shoesFound = shoe.findAll({
        where: {
            category: {
                [Op.eq]: req.params.category
            }
        }
    });

    shoesFound
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

let getShoeById = (req, res) => {

    let shoesFound = shoe.findAll({
        where: {
            sid: {
                [Op.eq]: req.params.sid
            }
        }
    });

    shoesFound
    .then((shoe) => {

        res.status(200).render('shoe', {shoe: shoe[0], 
                                        authenticated: req.isAuthenticated()});

    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Oops! Server side error");
    });

};

let getShoeByName = (req, res) => {

    let shoesFound = shoe.findAll({
        where: {
            name: {
                [Op.like]: `%${req.body.name}%`
            }
        }
    });

    shoesFound
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