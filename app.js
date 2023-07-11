const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

//targeting all ariticles----------------------------------------////
app
  .route("/articles")
  .get((req, res) => {
    Article.find()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    article
      .save()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete((req, res) => {
    Article.deleteMany({})
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send(err);
      });
  });

// targeting specific articles------------------///////////////

app
  .route("/articles/:articleTitle")
  .get(async (req, res) => {
    try {
      const foundArticle = await Article.findOne({
        title: req.params.articleTitle,
      });
      res.send(foundArticle);
    } catch (err) {
      res.send(err);
    }
  })
  .put((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },

      { title: req.body.title, content: req.body.content },

      { overwrite: true }
    ).then(result => {
      if(result){
        res.send(result)
      }else{
        res.send('no match!')
      }
    });
  })
  .patch((req, res)=>{

    Article.findOneAndUpdate(
      {title:req.params.articleTitle},
      {$set: req.body}
    ).then(result => {
      if(result){
        res.send("succesfully patched!");
      }else{
        res.send('no match!');
      }
    });
  })
.delete((req, res) =>{

  Article.findOneAndDelete({title:req.params.articleTitle})
  .then(result => {
    if(result){
      res.send("sucessfully deleted an article");
    }else{
      res.send("no matching article found!");
    }
  });
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
