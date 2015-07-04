var mongoose = require("mongoose");
var db = require("./model/database");

var Article = mongoose.model("Articles");
var Category = mongoose.model("Categories");
var Article_Category = mongoose.model("ArticlesCategories");
var Account = mongoose.model("Accounts");

//シード
var article = new Article();
article.title  = "はじめまして";
article.text = "test"; 
article.save(function(err) {
      if (err) { console.log(err); }
});

var category = new Category();
category.categoryName = "マジック";
category.save(function(err) {
      if (err) { console.log(err); }
});

var article_category = new Article_Category();
article_category.article_id  = article._id;
article_category.category_id = category._id;
article_category.save(function(err) {
          if (err) { console.log(err); }
});

var category = new Category();
category.categoryName = "雑記";
category.save(function(err) {
      if (err) { console.log(err); }
});

var article_category = new Article_Category();
article_category.article_id  = article._id;
article_category.category_id = category._id;
article_category.save(function(err) {
          if (err) { console.log(err); }
});

var account = new Account();
account.id = "koomainu";
account.password = "koomainukunn";
account.save(function(err) {
          if (err) { console.log(err); }
});

console.log("errがでなければ完了ですよ");
