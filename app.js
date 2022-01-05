//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const res = require("express/lib/response");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//TODO

mongoose.connect("mongodb://localhost:27017/ankitwikiDB");
// mongoose.connect(
//   "mongodb+srv://admin-admin:<Password>@cluster0.zosun.mongodb.net/ankitTodoDB"
// );

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("articles", articleSchema);

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    let title = req.body.title;
    let content = req.body.title;

    const newArticle = new Article({
      title: title,
      content: content,
    });
    newArticle.save();
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      if (!err) {
        res.send("Sucessfully deleted all Articles");
      } else {
        res.send(err);
      }
    });
  });

app
  // .route("/articles/:id")
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    // Article.findById(req.params.id, function (err, result) {
    Article.findOne({ title: req.params.articleTitle }, function (err, result) {
      if (!err) {
        res.send(result);
      } else {
        res.send(err);
      }
    });
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err, result) {
        if (!err) {
          res.send("Successfully updated article");
        } else {
          res.send("updating Article failed");
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      // { $set: { title: req.body.title, content: req.body.content } },
      { $set: req.body },
      function (err, result) {
        if (!err) {
          res.send("Successfully updated article");
        } else {
          res.send("updating Article failed");
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Successfully deleted article");
      } else {
        res.send("Article deletion failed");
      }
    });
  });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server started");
});
