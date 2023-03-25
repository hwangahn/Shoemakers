const { user } = require('../models/user');
const passport = require('passport');
const { Op } = require('sequelize');
const crypto = require('crypto');

let loginRequest = async (req, res, next) => {

    passport.authenticate('local', {
        session: true,
        successRedirect: '/',
        failureRedirect: '/login',
    })(req, res, next);

};

let registerRequest = async (req, res) => {
    
    if (req.body.password != req.body.passwordRetype) {
        res.status(200).render('register', {warning: "Password don't match password retyped"});
        return;
    } 

    try {

        let countUserWithUsername = await user.count({
            where: {
                username: {
                    [Op.eq]: req.body.username
                }
            }
        });

        if (countUserWithUsername != 0) {
            res.status(200).render('register', {warning: "Username already exist. Choose another"});
            return;
        }  

        let handleCreateUser = await user.create({
            username: req.body.username,
            password: crypto.createHmac('sha256', req.body.password)
                            .update('very secure trust me')
                            .digest('hex'),
            phone: req.body.phone,
            address: req.body.address
        });

        handleCreateUser;

        res.status(200).redirect('/login');
        
    } catch(err) {

        // catch errors
        console.log(err);
        res.status(500);
    }

};

let logoutRequest = async (req, res, next) => {

    req.logOut((err) => {
        res.status(500);
        return next(err);
    });

    res.status(200).redirect('/');

}

module.exports = { 
    loginRequest, 
    registerRequest, 
    logoutRequest 
};