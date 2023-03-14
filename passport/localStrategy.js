const crypto = require('crypto');
const { user } = require('../models/user');
const { Op } = require('sequelize');
const passport = require('passport');

let verify = (username, password, done) => {

    console.log(username);

    user.findOne({
        where: {
            username: {
                [Op.eq]: username
            }
        }
    })
    .then(theOneUser => {

        const hashedPassword = crypto.createHmac('sha256', password)
                                    .update('very secure trust me')
                                    .digest('hex');    
        if (hashedPassword === theOneUser.password) {
            done(null, theOneUser);
        } else {
            done(null, false, {messege: "Incorrect information"});
        }

    })
    .catch(err => {
        done(err);
    })
};

passport.serializeUser((user, done) => {
    done(null, user.uid);
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
        done(null, theOneUser);
    })
    .catch(err => {
        done(err);
    });
})

module.exports = verify;