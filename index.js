const express = require('express');
require('longjohn');
const session = require('express-session');
const passport = require('passport');
require('./models/initDB');
const { verify, signup } = require('./passport/localStrategy');
const LocalStrategy = require('passport-local');
const cors = require('cors');

let app = express();
let port = 4000;

app.set('views', './tools');
app.set('view engine', 'hbs');

app.use(cors({
    origin : "http://localhost:3000",
    credentials: true, 
}));

passport.use('login', new LocalStrategy(verify));
passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, signup));

app.use(express.urlencoded());
app.use(express.text());
app.use(express.json());
app.use(session({
    secret: "oh so secret",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.session());

app.use('/', require('./APIs/logonAPI'));
app.use('/', require('./APIs/goodsAPI'));
app.use('/', require('./APIs/cartAPI'));
app.use('/', require('./APIs/adminAPI'));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});