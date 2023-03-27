const express = require('express');
require('longjohn');
const session = require('express-session');
const passport = require('passport');
require('./models/initDB');
const path = require('path');
const verify = require('./passport/localStrategy');
const LocalStrategy = require('passport-local');
const hbs = require('hbs');

hbs.registerPartials(path.join(__dirname, '/views/partials'));

let app = express();
let port = 3000;

passport.use(new LocalStrategy(verify));

app.use(express.urlencoded());
app.use(express.text());
app.use(express.json());
app.use(session({
    secret: "oh so secret",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.session());


app.set('view engine', 'hbs');
app.use('/', require('./routers/logonRouter'));
app.use('/', require('./routers/goodsRouter'));
app.use('/', require('./routers/cartRouter'));
app.use('/', require('./routers/adminRouter'));

app.get('/', (req, res) => {
    res.status(200).render('home', {authenticated: req.isAuthenticated()});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});