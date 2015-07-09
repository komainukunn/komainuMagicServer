//モジュールの読み込み

console.log("test");

var app = require("express")();
var http = require("http").Server(app);
var fs = require("fs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//POSTのパース
app.use(bodyParser());

//コンソールの色をつける変数のjson
var color = {
    black   : "\u001b[30m", 
    red     : "\u001b[31m", 
    green   : "\u001b[32m", 
    yellow  : "\u001b[33m", 
    blue    : "\u001b[34m", 
    magenta : "\u001b[35m", 
    cyan    : "\u001b[36m", 
    white   : "\u001b[37m", 

    reset   : "\u001b[0m" 
}

//テータベースの設定
require("./model/database")(mongoose);

//共通のルーティング
require("./node/general")(app,fs,color);
//共通のapi
require("./node/general-api")(app,mongoose,color);
//ログイン/ログアウト関連
require("./node/session")(app,fs,mongoose,color);
//記事更新のapi
require("./node/article-api")(app,mongoose,color);
//カテゴリーのapi
require("./node/category-api")(app,mongoose,color);

app.set("port", (process.env.PORT || 5000));

app.use(function(req, res) {
    res.send("404: Page not Found", 404);
});

app.listen(app.get("port"), function() {
  console.log("Node app is running at localhost:" + app.get("port"));
});
