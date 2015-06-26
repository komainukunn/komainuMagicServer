var app = require("express")();
var http = require("http").Server(app);
var fs = require("fs");

app.set("port", (process.env.PORT || 5000));

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


app.get("bower_components/jquery/dist/jquery.js", function(req, res){
      fs.readFile(
        "./bower_components/jquery/dist/jquery.js",
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

app.use(function(req, res) {
    res.send("404: Page not Found", 404);
});

app.listen(app.get("port"), function() {
  console.log("Node app is running at localhost:" + app.get("port"));
});
