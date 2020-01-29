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

app.get("/", function(req, res) {
    Article.find({"saved": false}, function(error, data) {
      var hbsObject = {
        article: data
      };
      console.log(hbsObject);
      res.render("articles", hbsObject);
    });
  });
  
  app.get("/saved", function(req, res) {
    Article.find({"saved": true}).populate("notes").exec(function(error, articles) {
      var hbsObject = {
        article: articles
      };
      res.render("saved", hbsObject);
    });
  });

app.get("/scrape", function(req, res){
    axios.get("https://www.nytimes.com/section/technology").then(function(response){
        var $ = cheerio.load(response.data);

        $("article h2").each(function(i, element){
            let result = {};
            result.title = $(this)
            .children("a")
            .text();

            result.summary = $(this)
            .children("p")
            .text();

            result.link = $(this)
            .children("a")
            .attr("href");

            db.Article.create(result)
            .then(function(dbArticle){
                console.log(dbArticle);

            }).catch(function(err){
                console.log(err);;
            });
        });
        res.send("Scrape Complete")
    });
});

app.get("/articles", function(req, res){
    Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.get("/articles/:id", function(req, res){
    Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle){
        res.json(dbArticle);

    }).catch(function(err){
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res){
    Note.create(req.body)
    .then(function(dbNote){

        return db.Article.findOneAndUpdate({_id: req.params.id }, { note: dbNote._id }, { new: true})
    })
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });