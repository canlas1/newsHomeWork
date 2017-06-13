const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const request = require('request');
const app = express();
const Article = require("./models/Article.js");
const Note = require('./models/Comment.js');
const exphbs = require('express-handlebars')

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

//use morgan logger and bodyparser
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Serves static content for the app from the "public" directory
app.use(express.static(process.cwd() + "/public"));

// Set Handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//mongoose connection
let db = mongoose.connection;

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect(`mongodb://localhost/dennisScrapeHW`);
}

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

//these are the routes!
require("./routes/htmlRoutes.js")(app);
require("./routes/apiRoutes")(app);

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
