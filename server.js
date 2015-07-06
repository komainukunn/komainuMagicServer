var app = require("express")();
var http = require("http").Server(app);
var fs = require("fs");
var bodyParser = require('body-parser');


app.set("port", (process.env.PORT || 5000));
app.use(bodyParser());

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
    db: 'session',
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
    console.log(req.session.user);
    if(req.session.user){
      next();
    }else{
      res.redirect('/login');
    }
};
//ログイン画面
app.get("/login", function(req, res){
    console.log("start -- req.session.user = " + req.session.user);
    var id    = req.query.id;
    var password = req.query.password;
    var query = { "id": id, "password": password };
    Account.find({},function(err, data){console.log("####### ALL find #########\n"+data)});
    Account.find({id:id},function(err, data){console.log("####### id find #########\n"+data)});
    Account.find({password:password},function(err, data){console.log("####### pass find #########\n"+data)});
    Account.find(query, function(err, data){
    console.log("####### query #########\n"+"query.id = "+query.id+"\nquery.password = "+query.password);
    console.log("###########################");
        if(err){
            console.log(err);
        }
        console.log(data+"\n\n\n");
        if(data == ""){
            console.log("***********失敗************\n\n\n\n\n");
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
            console.log("brefore -- req.session.user = " + req.session.user);
            req.session.user = id;
            console.log("after -- req.session.user = " + req.session.user);
            res.redirect('/account');
            console.log("***********成功************\n\n\n\n\n");
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
        res.send({"massage":"not login"});
    }
};

//jsのルーティング
app.get("/scripts/account.js", function(req, res){
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

//cssのルーティング
app.get("/styles/account.css", function(req, res){
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
    if(!req.query.id){return;};
    var catItem = [];
    //コールバックの非同期処理で同期的に関数を動かすためのカウンター
    var cnt = 0;

    var art_id =req.query.id
    
    //パラメーターの記事を取得
    Article.find({_id:art_id},{},{sort:{date: -1},limit:1}, function(err, art){
        //記事のidから対応してるカテゴリーのidを検索
        Article_Category.find({ article_id:art[0]._id }, function(err, docs) {
            for (var i=0, size=docs.length; i<size; ++i) {
                Category.find({"_id":docs[i].category_id},function(err, cats) {
                    catItem.push(cats[0].categoryName);
                    cnt++;
                    if(cnt >= size){
                        var sendArticle = {
                            "_id" : art[0]._id,
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

var testCreateJson = {
    "title":"create",
    "text":"createしました",
    "categories":["create01","create02"]
}

//create
app.post("/account/api/create",apiLoginCheck,function(req,res){
    var title = req.body.title,
        text = req.body.text,
        categories = req.body.setCategories;

    var article = new Article();
    article.title  = title;
    article.text = text; 
    article.save(function(err) {
        if (err) { console.log(err); }
    });
    //同期のためのcnt
    var cnt=0;
    for(var i=0;i<categories.length;i++){
        Category.find({categoryName:categories[i]},function(err, cat){
            if(cat!=""){
                var article_category = new Article_Category();
                article_category.article_id  = article._id;
                article_category.category_id = cat[0]._id;
                article_category.save(function(err) {
                    if (err) { console.log(err);
                    }
                    res.send({"massage":"success"});
                });
            }else{
                var category = new Category();
                category.categoryName = categories[cnt];
                category.save(function(err) {
                    if (err) { console.log(err); }
                });
                var article_category = new Article_Category();
                article_category.article_id  = article._id;
                article_category.category_id = category._id;
                article_category.save(function(err) {
                    if (err) { console.log(err); }
                    res.send({"massage":"success"});
                });
            }
            cnt++;
        });
    }
});

var testUpdateJson = {
    "_id":"5597ee0d9352b369108b5675",
    "title":"update",
    "text":"かえた",
    "categories":["update01","update02"]
}

//update
app.post("/account/api/update",apiLoginCheck,function(req,res){
    console.log(req.body);
    var art_id = req.body._id,
        title = req.body.title,
        text = req.body.text,
        categories = req.body.categories;

    Article.update({_id:art_id},{title:title,text:text},function(err){
                         if (err) { console.log(err); }
    });
    //一回カテゴリーの紐つけを消す
    Article_Category.remove({ article_id:art_id }, function(err) {
        if (err) { console.log(err); }
    });
    //同期のためのcnt
    var cnt=0;
    for(var i=0;i<categories.length;i++){
        Category.find({categoryName:categories[i]},function(err, cat){
            if(cat!=""){
                var article_category = new Article_Category();
                article_category.article_id  = art_id;
                article_category.category_id = cat[0]._id;
                article_category.save(function(err) {
                    if (err) { console.log(err); }
                });
            }else{
                var category = new Category();
                category.categoryName = categories[cnt];
                category.save(function(err) {
                    if (err) { console.log(err); }
                });
                var article_category = new Article_Category();
                article_category.article_id  = art_id;
                article_category.category_id = category._id;
                article_category.save(function(err) {
                    if (err) { console.log(err); }
                });
            }
            cnt++;
        });
    }
});

//delete
app.get("/account/api/delete",apiLoginCheck,function(req,res){
    if(!req.query.id){return;};
    var art_id = req.query.id; 
    
    Article_Category.remove({ article_i:art_id }, function(err) {
        if (err) { console.log(err); }
    });

    Article.remove({ _id: art_id }, function(err) {
        if (err) { console.log(err); }
        res.send({"message":"success"});
    });
});










/*
 *  カテゴリー用 api
 */

//index
app.get("/account/category/api/",apiLoginCheck,function(req,res){
    var categoryNames = [];
    Category.find({}, function(err, cats){
        for(var i=0;i<cats.length;i++){
            categoryNames.push(cats[i].categoryName);
        }
        res.send({"categoryNames":categoryNames});
    })
});

//create
app.get("/account/category/api/create",apiLoginCheck,function(req,res){
    var catName = req.query.categoryName;
    
    var category = new Category();
    category.categoryName = catName;
    category.save(function(err) {
        if (err) { console.log(err); }
        var categoryNames = [];
        Category.find({}, function(err, cats){
            for(var i=0;i<cats.length;i++){
                categoryNames.push(cats[i].categoryName);
            }
            res.send({"categoryNames":categoryNames});
        })
    });

});


//delete
app.get("/account/category/api/delete",apiLoginCheck,function(req,res){
    if(!req.query.categoryName){return;};

    var catName = req.query.categoryName; 
    Category.find({categoryName:catName},function(err,data){
        if(!data[0]){return;};
        Article.remove({ _id: data[0]._id }, function(err) {
            if (err) { console.log(err); }
            Category.remove({ categoryName:catName }, function(err) {
                if (err) { console.log(err); }
                var categoryNames = [];
                Category.find({}, function(err, cats){
                    for(var i=0;i<cats.length;i++){
                        categoryNames.push(cats[i].categoryName);
                    }
                    res.send({"categoryNames":categoryNames});
                })
            });
        });
    });
});










app.use(function(req, res) {
    res.send("404: Page not Found", 404);
});


app.listen(app.get("port"), function() {
  console.log("Node app is running at localhost:" + app.get("port"));
});
