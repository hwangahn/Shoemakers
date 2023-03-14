const { user } = require('../models/user');
const passport = require('passport');
const { Op } = require('sequelize');
const crypto = require('crypto');

let loginRequest = (req, res, next) => {

    console.log(req.body.username);
    console.log(req.body.password);

    passport.authenticate('local', {
        session: true,
        successRedirect: '/',
        failureRedirect: '/login'
    })(req, res, next);

};

let registerRequest = (req, res) => {

    // console.log(req.body.username);
    // console.log(req.body.password);
    // console.log(req.body.passwordRetype);

    if (req.body.password != req.body.passwordRetype) {
        res.status(200).render('register', {warning: "Password don't match password retyped"});
    } 
    user.findAll({
        where: {
            username: {
                [Op.eq]: req.body.username
            }
        }
    })
    .then(existUser => {

        let count = 0;
        existUser.forEach(Element => {
            count ++;
        });

        if (count) {
            res.status(300).render('register', {warning: "Username already exist. Choose another"});
        } else {
            user.create({
                username: req.body.username,
                password: crypto.createHmac('sha256', req.body.password)
                                .update('very secure trust me')
                                .digest('hex'),
            });
            res.status(200).redirect('/login');
        }
    })
    .catch(err => {
        console.log(err);
    });

};

let logoutRequest = (req, res, next) => {

    req.logOut((err) => {
        res.status(500);
        return next(err);
    });

    res.status(200).redirect('/');

}

module.exports = { loginRequest, registerRequest, logoutRequest };