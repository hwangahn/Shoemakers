const express = require('express');
const bodyParser = require('body-parser');
require('longjohn');
const session = require('express-session');
const passport = require('passport');
require('./models/initDB');
const path = require('path');
const { verify, signup } = require('./passport/localStrategy');
const LocalStrategy = require('passport-local');
const hbs = require('hbs');
const cors = require('cors');


hbs.registerPartials(path.join(__dirname, '/views/partials'));

let app = express();
let port = 4000;

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

app.use('/', require('./routers/logonRouter'));
app.use('/', require('./routers/goodsRouter'));
app.use('/', require('./routers/cartRouter'));
app.use('/', require('./routers/adminRouter'));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});