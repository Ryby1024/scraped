const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const Note = require("./models/Note.js");
const Article = require("./models/Article.js");

const PORT = process.env.PORT || 3000;

const app = express();
const exphbs = require("express-handlebars");
const path = require("path");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main", partialsDir: path.join(__dirname, "/views/layouts/partials") }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/", function (req, res) {
    Article.find({ "saved": false }).then(function (dbArticle) {
        let articles = [];
        for (const el of dbArticle) {
            articles.push({ id: el._id, title: el.title, summary: el.summary, link: el.link });

        };
        res.render("index", { article: articles });

    });

});

app.get("/saved", function (req, res) {
    Article.find({ "saved": true }).populate("note").exec(function (error, dbArticle) {
        
        let articles = [];
        for (const el of dbArticle) {
            let article = { id: el._id, title: el.title, summary: el.summary, link: el.link}
            // console.log(article)
            if(el.note) { 
                article.note = el.note.body
                article.noteID = el.note._id
            }
            articles.push(article);

        };
        
        res.render("savedarticles", { article: articles });

    });



});
app.get("/scrape", function (req, res) {
    console.log("scraped")
    axios.get("https://www.nytimes.com/section/technology").then(function (response) {
        let $ = cheerio.load(response.data);


        $("article h2").each(function (i, element) {
            let result = {};
            result.title = $(this)
                .children("a")
                .text();

            result.summary = $(this)
                .parent()
                .children("p")
                .text();

            result.link = "https://www.nytimes.com" + $(this)
                .children("a")
                .attr("href");

            if (result.title !== "" && result.link !== "") {
                Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);

                    }).catch(function (err) {
                        console.log(err);;
                    });

            } else {
                console.log("Not saved to DB, missing data");
            }
        })



    });
    res.send("Scrape complete")
    res.redirect("/")
});

app.post("/notes/save/:id", function (req, res) {
    Note.create(req.body)
        .then(function (dbNote) {
            return Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
        })
        .then(function (dbArticle) {
            res.json(dbArticle);

        })
        .catch(function (err) {
            res.json(err);
        });
});
app.delete("/notes/delete/:id", function (req, res) {
    console.log(req.params)
    Note.findByIdAndRemove(
        {
            _id: req.params.id
        },
        function (error, removed) {
            if (error) {
                console.log(error)
                res.send(error)
            } else {
                console.log(removed);
                res.redirect("/saved")
            }
        }
    )
})



app.post("/articles/save/:id", function (req, res) {

    Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(doc);
            }
        });
});
app.post("/articles/delete/:id", function (req, res) {
    Article.findOneAndUpdate({ "_id": req.params.id }, { saved: false })
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {

                res.send(doc);
            }
        });
});
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});