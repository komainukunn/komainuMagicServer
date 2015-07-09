module.exports = function(app,fs,mongoose,color){
    //アカウントテーブル
    var Account = mongoose.model("Accounts");

    //セッション
    var session = require("express-session");
    var MongoStore = require("connect-mongo")(session);

    console.log("aaaaaa");
    //セッションの設定
    app.use(session({
        secret: "secret",
        store: new MongoStore({
            db: "session",
            host: "localhost",
            clear_interval: 60 * 60 
        }),
        cookie: { 
            httpOnly: false,
            maxAge: 60 * 60 * 1000
        }
    }));
    console.log("cccccc");

    //ログインページにリダイレクトさせる
    var loginCheck = function(req, res, next) {
        console.log("### loginCheck\nuser name --> " + req.session.user);
        if(req.session.user){
            next();
        }else{
            res.redirect("/login");
        }
    };

    //ログインページにリダイレクトさせる
    var apiLoginCheck = function(req, res, next) {
        console.log("### apiLoginCheck\nuser name --> " + req.session.user);
        if(req.session.user){
            next();
        }else{
            res.send({message:"error"});
        }
    };



    //ヘッターの画像ルーティング
    app.get("/login", function(req, res){
        console.log(color.yellow + "+++ /login.html start" + color.reset);
        fs.readFile(
            "./login.html",
            function (err, data) {
                if (err) {
                    // とりあえずconsole.logでログを残す
                    // エラーが出たらnodeは死ぬのでendする
                    console.log(color.red + "/login.html error - fs.readFile" + color.reset);
                    console.log(err+"\n");
                    res.writeHead(500);
                    res.end("Server error : " + err);
                }
                // HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
                res.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
                res.end(data);
                console.log(color.green + "+++ /login.html res.send succsess!" + color.reset);
            }
        );
    });


    //ログイン画面
    app.get("/loginJug", function(req, res){
        
        console.log(color.yellow + "### /loginJug start" + color.reset);
        //idとpassを取得しクエリを作成
        var id    = req.query.id;
        var password = req.query.password;
        var query = { "id": id, "password": password };
        
        console.log("req.query.id -->" + req.query.id );
        console.log("req.query.password -->" + req.query.password );

        //アカウントテーブルよりアカウントを検索する
        Account.find(query, function(err, data){
            if(err){
                console.log(color.red + "/loginJug error - Account.find" + color.reset);
                console.log(err+"\n");
            }
            if(data == ""){
                res.redirect("/login")
                console.log(color.cyan  + "### /loginJug login miss!" + color.reset);
            }else{
                req.session.user = id;
                res.redirect("/account");
                console.log(color.green + "### /loginJug login success!" + color.reset);
            }
        });
    });


    //ログイン後
    app.get("/account", loginCheck, function(req, res){
        console.log(color.yellow + "+++ /account start" + color.reset);
        fs.readFile(
            "./account.html",
            function (err, data) {
                if (err) {
                    // とりあえずconsole.logでログを残す
                    // エラーが出たらnodeは死ぬのでendする
                    console.log(color.red + "/account.html error - fs.readFile" + color.reset);
                    console.log(err+"\n");
                    res.writeHead(500);
                    res.end("Server error : " + err);
                }
                // HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
                res.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
                res.end(data);
                console.log(color.green + "+++ /account res.send succsess!" + color.reset);
            }
        );
    });

    //jsのルーティング
    app.get("/scripts/account.js", function(req, res){
        console.log(color.yellow + "+++ /scripts/account.js start" + color.reset);
        fs.readFile(
            "./scripts/app.js",
            function (err, data) {
                if (err) {
                    // とりあえずconsole.logでログを残す
                    // エラーが出たらnodeは死ぬのでendする
                    console.log(color.red + "/scripts/account.js error - fs.readFile" + color.reset);
                    console.log(err+"\n");
                    res.writeHead(500);
                    res.end("Server error : " + err);
                }
                // HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
                res.writeHead(200, {"Content-Type": "text/javascript; charset=UTF-8"});
                res.end(data);
                console.log(color.green + "+++ /scripts/account.js res.send succsess!" + color.reset);
            }
        );
    });

    //cssのルーティング
    app.get("/styles/account.css", function(req, res){
        console.log(color.yellow + "+++ /styles/account.css start" + color.reset);
        fs.readFile(
            "./styles/main.css",
            function (err, data) {
                if (err) {
                    // とりあえずconsole.logでログを残す
                    // エラーが出たらnodeは死ぬのでendする
                    console.log(color.red + "/styles/account.css error - fs.readFile" + color.reset);
                    console.log(err+"\n");
                    res.writeHead(500);
                    res.end("Server error : " + err);
                }
                // HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
                res.writeHead(200, {"Content-Type": "text/css; charset=UTF-8"});
                res.end(data);
                console.log(color.green + "+++ /styles/account.css res.send succsess!" + color.reset);
            }
        );
    });


    //ログアウト
    app.get("/logout", function(req, res){
        console.log("### /logout start");
        req.session.destroy();
        res.redirect("/");
        console.log("### /logout deleted sesstion");
    });


}
