const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const Note = require("./models/Note.js");
const Article = require("./models/Article.js");

const PORT = process.env.PORT || 3000;

const app = express();
const exphbs = require("express-handlebars");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/nyscrape", { useNewUrlParser: true });

app.get("/", function (req, res) {
    Article.find({}).then(function (dbArticle) {
        let articles = [];
        for (const el of dbArticle) {
            articles.push({ id: el._id, title: el.title, summary: el.summary, link: el.link });

        };
        res.render("index", { article: articles });

    });

    app.get("/articles/:id", function (req, res) {
        Article.findOne({_id: req.params.id}).then(function (dbArticle) {
            let myArticle = [];
        for (const el of dbArticle) {
            myArticle.push({ id: el._id, title: el.title, summary: el.summary, link: el.link });
        }
        res.render("articles",{article: myArticle} )
        }).catch(function (err) {
            res.json(err);
        });

    });

});
app.get("/scrape", function (req, res) {
    console.log("scraped")
    axios.get("https://www.nytimes.com/section/technology").then(function (response) {
        var $ = cheerio.load(response.data);

        let titlesArray = [];
        $("article h2").each(function (i, element) {
            let result = {};
            result.title = $(this)
                .children("a")
                .text();

            result.summary = $(this)
                .parent()
                .children("p")
                .text();

            result.link = $(this)
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
   res.redirect("/")
});




app.get("/articles/:id", function (req, res) {
    Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);

        }).catch(function (err) {
            res.json(err);
        });
});

app.post("/comment/:id", function (req, res) {
    Note.create(req.body)
        .then(function (dbNote) {

            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});
app.get("/save/:id", function(req, res){
    Article.update({_id: req.params.id}, {saved: true})
    .then(function(dbArticle){
        res.render("savedarticles", {articles: dbArticle})
    }).catch(function(err){
        res.json(err)
    });
});
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});