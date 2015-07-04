var app = require("express")();
var http = require("http").Server(app);
var fs = require("fs");

app.set("port", (process.env.PORT || 5000));


/*
 *  メインページのルーティング
 */

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

/*
 * 共通のapiサーバーのルーティング
 */


//Mongo部分
var mongoose = require("mongoose");
var db = require("./model/database");

var Article = mongoose.model("Articles");
var Category = mongoose.model("Categories");
var Article_Category = mongoose.model("ArticlesCategories");
var Account = mongoose.model("Accounts");

app.get("/api/new-article", function(req, res){
    var catItem = [];
    //コールバックの非同期処理で同期的に関数を動かすためのカウンター
    var cnt = 0;
    //最新の記事を取り出すクエリ
    //最新の記事をソートして取り出す
    Article.find({},{},{sort:{date: -1},limit:1}, function(err, art){
        //記事のidから対応してるカテゴリーのidを検索
        Article_Category.find({ "article_id":art[0]._id }, function(err, docs) {
            for (var i=0, size=docs.length; i<size; ++i) {
                Category.find({"_id":docs[i].category_id},function(err, cats) {
                    catItem.push(cats[0].categoryName);
                    cnt++;
                    if(cnt >= size){
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

/*
 *  アカウント関連
 */

//セッション
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: "secret",
  store: new MongoStore({
    db: 'komainukunndb',
    host: 'localhost',
    clear_interval: 60 * 60
  }),
  cookie: {
    httpOnly: false,
    maxAge: new Date(Date.now() + 60 * 60 * 1000)
  }
}));

//ログインページにリダイレクトさせる
var loginCheck = function(req, res, next) {
    if(req.session.user){
      next();
    }else{
      res.redirect('/login');
    }
};
//ログイン画面
app.get("/login", function(req, res){
    var id    = req.query.id;
    var password = req.query.password;
    var query = { "id": id, "password": password };
    Account.find(query, function(err, data){
        if(err){
            console.log(err);
        }
        if(data == ""){
            fs.readFile(
                "./login.html",
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
            )
        }else{
            req.session.user = id;
            res.redirect('/account');
        }
    });
});


//ログイン後
app.get("/account", loginCheck, function(req, res){
      fs.readFile(
        "./account.html",
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

//ログアウト
app.get("/logout", function(req, res){
  req.session.destroy();
  console.log("deleted sesstion");
  res.redirect("/");
});

/*
 *   編集者用のapi
 */


//ログインページにリダイレクトさせる
var apiLoginCheck = function(req, res, next) {
    if(req.session.user){
        next();
    }else{
        res.send({"error":"not login"});
    }
};

//index
app.get("/account/api/",apiLoginCheck,function(req,res){
    var art_ids = [];
    var artTitles = [];
    var artDates = [];
    Article.find({},{},{sort:{date: -1}}, function(err, arts){
        for(var i=0,size=arts.length; i<size; i++){
            art_ids.push(arts[i]._id);
            artTitles.push(arts[i].title);
            artDates.push(arts[i].date);
            if(i>=size-1){
                res.send({"_ids":art_ids,"titles":artTitles, "dates":artDates});
            }
        }
    })
});

//例 http://localhost:5000/account/api/show?id=5597a991416b5ddc0c3ebb6f
//show
app.get("/account/api/show",apiLoginCheck,function(req,res){

    var catItem = [];
    //コールバックの非同期処理で同期的に関数を動かすためのカウンター
    var cnt = 0;

    var art_id =req.query.id
    
    //パラメーターの記事を取得
    Article.find({"_id":art_id},{},{sort:{date: -1},limit:1}, function(err, art){
        //記事のidから対応してるカテゴリーのidを検索
        Article_Category.find({ "article_id":art[0]._id }, function(err, docs) {
            for (var i=0, size=docs.length; i<size; ++i) {
                Category.find({"_id":docs[i].category_id},function(err, cats) {
                    catItem.push(cats[0].categoryName);
                    cnt++;
                    if(cnt >= size){
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

//create
app.post("/account/api/create",apiLoginCheck,function(req,res){

});

//update
app.post("/account/api/update",apiLoginCheck,function(req,res){
});

//delete
app.get("/account/api/delete",apiLoginCheck,function(req,res){
});

app.use(function(req, res) {
    res.send("404: Page not Found", 404);
});


app.listen(app.get("port"), function() {
  console.log("Node app is running at localhost:" + app.get("port"));
});
