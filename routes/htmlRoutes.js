// Requiring our Comment and Article models
const Comment = require("../models/Comment.js");
const Article = require("../models/Article.js");

// Routes
// =============================================================
module.exports = function(app) {

    //Load homepage
    app.get("/", function(req, res) {
        Article.find({}, function(error, doc) {
            doc = doc.slice(0, 20);

            // Log any errors
            if (error) {
                console.log(error);
            } else {
                let hbsObject = {
                    articles: doc
                }
                console.log(hbsObject)
                res.render("index", hbsObject);
            }
        });
    });

    // This will get the articles we scraped from the mongoDB
    app.get("/articles", function(req, res) {
        // Grab every doc in the Articles array
        Article.find({}, function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Or send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
    });

    // Grab an article by it's ObjectId
    app.get("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        Article.findOne({ "_id": req.params.id })
            // ..and populate all of the comments associated with it
            .populate("comment")
            // now, execute our query
            .exec(function(error, doc) {
                // Log any errors
                if (error) {
                    console.log(error);
                }
                // Otherwise, send the doc to the browser as a json object
                else {
                    res.json(doc);
                }
            });
    });

};
