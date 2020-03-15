//import express module 
var express = require('express');
//create  an express app
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
//require express session
var session = require('express-session');
let cors = require("cors"); //  npm install cors
var config = require('./config/basicConfig');
var cookieParser = require('cookie-parser');
const { mongoDB } = require('./config/mongoConfig');
const mongoose = require('mongoose');

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 500,
    bufferMaxEntries: 0
};


mongoose.connect(mongoDB, options, (err, res) => {
    if (err) {
        console.log(err);
        console.log(`MongoDB Connection Failed`);
    } else {
        console.log(`MongoDB Connected`);
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret              : 'cmpe273_lab1_yilinzhou',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

let front_url = config.host + ':' +config.front_end_port;

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', front_url);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });


app.use(cors({
       origin: true,
       credentials: true,
    // 　　methods: ["GET", "POST","PUT"],
    // 　　alloweHeaders: ["Content-Type", "application/json;application/x-www-form-urlencoded"]
}));
app.use(cookieParser())

var loginRouter = require('./src/loginRoutes/loginRouter')
app.use('/login',loginRouter);

var signupRouter = require('./src/loginRoutes/signupRouter')
app.use('/signup',signupRouter);

var profRouter = require('./src/profileRoutes/profileRouter')
app.use('/profile',profRouter);

var jobRouter = require('./src/jobRoutes/jobRouters')
app.use('/job',jobRouter);

var stuRouter = require('./src/studentRoutes/studentRouters')
app.use('/student',stuRouter);

var eventRouter = require('./src/eventRoutes/eventRouters')
app.use('/event',eventRouter);

app.listen(3001, function () {
    console.log("Server listening on port 3001");
});