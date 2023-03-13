const express = require('express');
const passport = require('passport');
const path = require('path');

let app = express();
let port = 3000;

app.use(express.urlencoded());
app.use(express.text());
app.use(express.json());

// app.set('views', path.join(__dirname + '/view'));
app.set('view engine', 'hbs');

app.use('/', require('./router/goodsRouter'));
// app.use('/', require('./controller/loginController'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './views/home.html'));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});