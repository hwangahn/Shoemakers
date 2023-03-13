const { shoes } = require('../model/goods');
const path = require('path');
const { Op } = require('sequelize');

let getShoeByCategory = (req, res) => {

    if (req.params.category != "favicon.ico" && req.params.category != "search") {

        let shoesFound = shoes.findAll({
            where: {
                category: {
                    [Op.eq]: req.params.category
                }
            }
        });

        shoesFound
        .then((shoes) => {
            console.log(shoes);
            res.status(200).render('goods', {shoes: shoes,
                                             category: req.params.category});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Oops! Server side error");
        });

    }

};

let getShoeById = (req, res) => {

    let shoesFound = shoes.findAll({
        where: {
            sid: {
                [Op.eq]: req.params.sid
            }
        }
    });

    shoesFound
    .then((shoe) => {

        console.log(shoe);
        shoe.forEach(element => {
            res.status(200).render('shoe', {shoe: element});
        });

    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Oops! Server side error");
    });

};

let getShoeByName = (req, res) => {

    let shoesFound = shoes.findAll({
        where: {
            name: {
                [Op.like]: `%${req.body.name}%`
            }
        }
    });

    shoesFound
    .then((shoes) => {
        console.log(shoes);
        res.status(200).render('goods', {shoes: shoes});
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