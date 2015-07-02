var mongoose = require("mongoose");

//テーブル作成
var Schema   = mongoose.Schema;

var ArticleTable = new Schema({
  title:{type: String, required: true},
  text:{type: String, required: true},
  data:{type: Date, default: Date.now}
});

var CategoryTable = new Schema({
    categoryName:{type: String, required: true}
});

var ArticleCategoryTable = new Schema({
    article_id:{type: Object, required:true},
    category_id:{type: Object, required:true}
});

mongoose.model("Articles",ArticleTable);
mongoose.model("Categories",CategoryTable);
mongoose.model("ArticlesCategories",ArticleCategoryTable);

//接続
mongoose.connect("mongodb://localhost/komainukunndb");

var Article = mongoose.model("Articles");
var Category = mongoose.model("Categories");
var Article_Category = mongoose.model("ArticlesCategories");

//シード
var article = new Article();
article.title  = "Mongo Test";
article.text = "ドキドキのテスト"; 
article.save(function(err) {
      if (err) { console.log(err); }
});

var category = new Category();
category.categoryName = "カテゴリー1";
category.save(function(err) {
      if (err) { console.log(err); }
});

category.categoryName = "カテゴリー2";
category.save(function(err) {
      if (err) { console.log(err); }
});

var article_category = new Article_Category();
article_category.article_id  = article._id;
article_category.category_id = category._id;
article_category.save(function(err) {
          if (err) { console.log(err); }
});

console.log("end");
