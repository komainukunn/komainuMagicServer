var app = require("express")();
var http = require("http").Server(app);
var fs = require("fs");

app.set("port", (process.env.PORT || 5000));

//ヘッターの画像ルーティング
app.get("/images/header_back_image_b.jpg", function(req, res){
      fs.readFile(
        "./images/header_back_image_b.jpg",
        function (err, data) {
            if (err) {
                // とりあえずconsole.logでログを残す
                // エラーが出たらnodeは死ぬのでendする
                console.log(err);
                res.writeHead(500);
                res.end("Server error : " + err);
            }
            // HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
            res.writeHead(200, {"Content-Type": "text/css; charset=UTF-8"});
            res.end(data);
        }
    );
});

//cssのルーティング
app.get("/styles/main.css", function(req, res){
      fs.readFile(
        "./styles/main.css",
        function (err, data) {
            if (err) {
                // とりあえずconsole.logでログを残す
                // エラーが出たらnodeは死ぬのでendする
                console.log(err);
                res.writeHead(500);
                res.end("Server error : " + err);
            }
            // HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
            res.writeHead(200, {"Content-Type": "text/css; charset=UTF-8"});
            res.end(data);
        }
    );
});

//jsのルーティング
app.get("/scripts/app.js", function(req, res){
      fs.readFile(
        "./scripts/app.js",
        function (err, data) {
            if (err) {
                // とりあえずconsole.logでログを残す
                // エラーが出たらnodeは死ぬのでendする
                console.log(err);
                res.writeHead(500);
                res.end("Server error : " + err);
            }
            // HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
            res.writeHead(200, {"Content-Type": "text/javascript; charset=UTF-8"});
            res.end(data);
        }
    );
});

//venderのルーティング
app.get("/scripts/vendor.js", function(req, res){
      fs.readFile(
        "./scripts/vendor.js",
        function (err, data) {
            if (err) {
                // とりあえずconsole.logでログを残す
                // エラーが出たらnodeは死ぬのでendする
                console.log(err);
                res.writeHead(500);
                res.end("Server error : " + err);
            }
            // HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
            res.writeHead(200, {"Content-Type": "text/javascript; charset=UTF-8"});
            res.end(data);
        }
    );
});

//indexのルーティング
app.get("/", function(req, res){
      fs.readFile(
        "./index.html",
        function (err, data) {
            if (err) {
                // とりあえずconsole.logでログを残す
                // エラーが出たらnodeは死ぬのでendする
                console.log(err);
                res.writeHead(500);
                res.end("Server error : " + err);
            }
            // HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
            res.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
            res.end(data);
        }
    );
});


//Mongo部分
var mongoose = require("mongoose");
var db = require("./model/database");

var Article = mongoose.model("Articles");
var Category = mongoose.model("Categories");
var Article_Category = mongoose.model("ArticlesCategories");

app.get("/api/new-article", function(req, res){
   
    var catItem = [];
    //最新の記事を取り出すクエリ
    Article.find({},{},{sort:{date: -1},limit:1}, function(err, art){
        Article_Category.find({ "article_id":art[0]._id }, function(err, docs) {
            for (var i=0, size=docs.length; i<size; ++i) {
                Category.find({"_id":docs[i].category_id},function(err, cats) {
                    catItem.push(cats[0].categoryName);
                    if(i >= size-1){
                        var sendArticle = { 
                            "title" : art[0].title,
                            "text" : art[0].text,
                            "categories":catItem,
                            "date" : art[0].date
                        } 
                        res.send(sendArticle);
                    }
                }) 
            }
        });
    });
});

app.use(function(req, res) {
    res.send("404: Page not Found", 404);
});


app.listen(app.get("port"), function() {
  console.log("Node app is running at localhost:" + app.get("port"));
});
