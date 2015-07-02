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
