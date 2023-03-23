const crypto = require('crypto');
const { user } = require('../models/user');
const { Op } = require('sequelize');
const passport = require('passport');

let verify = (username, password, done) => {

    user.findOne({
        where: {
            username: {
                [Op.eq]: username
            }
        }
    })
    .then(theOneUser => {

        if (theOneUser === null) {
            return done(null, false, {messege: "Wrong username or password"});
        }

        const hashedPassword = crypto.createHmac('sha256', password)
                                    .update('very secure trust me')
                                    .digest('hex');    
        if (hashedPassword === theOneUser.password) {
            return done(null, theOneUser);
        } else {
            return done(null, false, {messege: "Incorrect information"});
        }

    })
    .catch(err => {
        done(err);
    });
};

passport.serializeUser((user, done) => {
    return done(null, user.uid);
});

passport.deserializeUser((id, done) => {
    user.findOne({
        where: {
            uid: {
                [Op.eq]: id
            }
        }
    })
    .then(theOneUser => {
        return done(null, theOneUser);
    })
    .catch(err => {
        return done(err);
    });
})

module.exports = verify;