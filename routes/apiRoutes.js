const Article = require("../models/Article.js");
// Requiring our Comment and Article models
const Comment = require("../models/Comment.js");
// Our scraping tools
const request = require("request");
const cheerio = require("cheerio");

module.exports = function(app) {

        // A GET request to scrape the echojs website
        app.get("/scrape", function(req, res) {
                // First, we grab the body of the html with request
                request("https://www.nytimes.com/section/technology?WT.nav=page&action=click&contentCollection=Tech&module=HPMiniNav&pgtype=Homepage&region=TopBar", function(error, response, html) {
                    // Then, we load that into cheerio and save it to $ for a shorthand selector
                    let $ = cheerio.load(html);


                    //in order div.stream then to ol then to li then to story-body.  GET ME THE TITLE

                    $("div.stream ol li article.story div.story-body").each(function(i, element) {

                        //get titles
                        let title = $(this).children("a.story-link").children("div.story-meta").children("h2.headline").text().trim();

                        //get the link!!
                        let link = $(this).children("a.story-link").attr("href");
                        console.log("=======================")
                        console.log(title)
                        console.log(link)
                        console.log("=======================")

                        // Save an empty result object
                        var result = {};

                        // Add the text and href of every link, and save them as properties of the result object
                        result.title = title;
                        result.link = link;

                        // Using our Article model, create a new entry
                        // This effectively passes the result object to the entry (and the title and link)
                        var entry = new Article(result);

                        // Now, save that entry to the db
                        entry.save(function(err, doc) {
                            // Log any errors
                            if (err) {
                                console.log(err);
                            }
                            // Or log the doc
                            else {
                                console.log(doc);
                            }
                        });

                    });
                });

                res.redirect("/");

            });

app.post("/articles/comment/:id", function(req, res) {
        // Create a new comment and pass the req.body to the entry
        var newComment = new Comment(req.body);
        console.log("========================")
        console.log("This is the comment")
        console.log(newComment);


        // And save the new comment the db
        newComment.save(function(error, doc) {
            console.log("This is the doc")
            console.log(doc)
            console.log("=======================")
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise
            else {
                // Use the article id to find and update it's comment
                Article.findOneAndUpdate({ "_id": req.params.id }, { "comment": doc})
                    // Execute the above query
                    .exec(function(err, doc) {
                        console.log("This is the doc")
                        console.log(doc);

                        // Log any errors
                        if (err) {
                            console.log(err);
                        }
                         else {
                             // Or send the document to the browser
                             res.send(doc);
                         }
                    });
            }
        });
    });
};

