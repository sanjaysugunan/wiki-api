const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app =express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));


mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");

const articleSchema ={
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//////////////////Requests Targeting All Articles///////////////////////////////////
app.route("/articles")
 .get(function(req,res){
    Article.find({}).then((foundArticles)=>{
        res.send(foundArticles);
    }).catch((err)=>{
        res.send(err);
    })
  })
 .post( function(req,res){
    const post = new Article({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(()=>{
        res.send("saved article");
    }).catch((err)=>{
            res.send(err);
    });
 })
 .delete(function(req,res){
    Article.deleteMany({}).then(()=>{
        res.send("deleted all articles");
    }).catch((err)=>{
            res.send(err);
    });
 });

///////////////////////Requests targeting a specific Article////////////////////////////////

app.route("/articles/:articleTitle")
   .get(function(req,res){
      Article.findOne({title:req.params.articleTitle})
      .then((foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No Articles Found");
        }
      })
      .catch((err)=>{
        res.send(err);
      })
    })
   .put(function(req,res){
        Article.updateOne({title:req.params.articleTitle},{title:req.body.title, content:req.body.content})
        .then(()=>{
            res.send("Updated through put");
        });
   })
   .patch(function(req,res){
        Article.updateOne({title:req.params.articleTitle},
            {$set: req.body}
            )
        .then(()=>{
            res.send("Updated through patch");
        });
   })
   .delete(function(req,res){
        Article.deleteOne({title:req.params.articleTitle})
        .then(()=>{
            res.send("Article deleted");
        });
    });


app.listen(3000, ()=>{
    console.log("Server started on port 3000");
});
