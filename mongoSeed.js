var mongoose = require("mongoose");
require("./model/database")(mongoose);

var Article = mongoose.model("Articles");
var Category = mongoose.model("Categories");
var Article_Category = mongoose.model("ArticlesCategories");
var Account = mongoose.model("Accounts");

var seedCnt = 0;//終了のためのカウンター

//シード
var article = new Article();
article.title  = "はじめまして";
article.text = "test"; 
article.save(function(err) {
    if (err) { console.log(err); }
    seedExitJug();
});

var category = new Category();
category.categoryName = "マジック";
category.save(function(err) {
    if (err) { console.log(err); }
    seedExitJug();
});

var article_category = new Article_Category();
article_category.article_id  = article._id;
article_category.category_id = category._id;
article_category.save(function(err) {
    if (err) { console.log(err); }
    seedExitJug();
});

var category = new Category();
category.categoryName = "雑記";
category.save(function(err) {
    if (err) { console.log(err); }
    seedExitJug();
});

var article_category = new Article_Category();
article_category.article_id  = article._id;
article_category.category_id = category._id;
article_category.save(function(err) {
    if (err) { console.log(err); }
    seedExitJug();
});

var account = new Account();
account.id = "koomainu";
account.password = "a";
account.save(function(err) {
    if (err) { console.log(err);}
    seedExitJug();
});

function seedExitJug(){
    seedCnt++;
    if(seedCnt > 5){
        console.log("errがでなければ完了");
        process.exit();
    }
}
