const passport = require('passport');

let loginRequest = async (req, res, next) => {

    passport.authenticate('login', (err, user, info, status) => {
        if (err) {
            console.log(err);
        } else if (!user) {
            console.log(status);
            console.log(info);
            res.status(401).json({ path: '/login', msg: "Wrong credentials"});
        } else {
            req.login(user, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500);
                }
                res.status(200).json({ path: '/', msg: "OK"});
            });
        }
    })(req, res, next);
};

let registerRequest = async (req, res, next) => {

    passport.authenticate('signup', (err, user, info, status) => {
        if (err) {
            res.statuc(500).send(err);
        } else if (!user) {
            console.log(status);
            console.log(info);
            res.status(200).json({ path: '/register', msg: "Username already exist. Choose another"});
        } else {
            req.login(user, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500);
                }
                res.status(200).json({ path: '/', msg: "OK"});
            });
        }
    })(req, res, next);

};

let logoutRequest = (req, res) => {

    console.log("called");

    req.logOut((err) => {
        res.status(500);
    });

    res.status(200).json({msg: "OK"});

}

let checkCredential = (req, res) => {
    console.log(req.isAuthenticated());
    res.status(200).json({isLoggedIn: req.isAuthenticated()});
}

module.exports = { 
    loginRequest, 
    registerRequest, 
    logoutRequest,
    checkCredential 
};