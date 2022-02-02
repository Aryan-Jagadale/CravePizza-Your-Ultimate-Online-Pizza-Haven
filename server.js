require('dotenv').config();   //To access env
const express = require('express');
const app = express();
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000; // It may not be avaliable in Live Server
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require('passport');
const cookieParser = require('cookie-parser')

//mongoose connection
const url = process.env.MONGO_CONNECTION_URL;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})
connection.on('error',console.error.bind(console,'Connecction error'));


//session config    as a middleware
app.use(session({
    secret: process.env.COOKIES_SECRET, 
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: url,
        collectionName: 'sessions'
    }), 
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))
app.use(cookieParser());

//Passport Config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(flash()); 
app.use(express.urlencoded({ extended: false }));//To parse the data from the form

//Global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
})
//Assets
app.use(express.static('public'));

//set template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app);

app.use((req,res)=>{
    res.status(404).render('error/404');
})


app.listen(PORT,()=>{
    console.log(`https://localhost:${PORT}`);
})


