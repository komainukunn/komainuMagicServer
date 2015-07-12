module.exports = function(app,fs,color){

    //ヘッターの画像ルーティング
    app.get("/images/header_back_image_b.jpg", function(req, res){
        console.log(color.yellow + "+++ /images/header_back_image_b.jpg start" + color.reset);
        fs.readFile(
            "./images/header_back_image_b.jpg",
            function (err, data) {
                if (err) {
                    // とりあえずconsole.logでログを残す
                    // エラーが出たらnodeは死ぬのでendする
                    console.log(color.red + "/images/header_back_image_b.jpg error - fs.readFile" + color.reset);
                    console.log(err+"\n");
                    res.writeHead(500);
                    res.end("Server error : " + err);
                }
                // HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
                res.writeHead(200, {"Content-Type": "text/css; charset=UTF-8"});
                res.end(data);
                console.log(color.green + "+++ /images/header_back_image_b.jpg res.send succsess!" + color.reset);
            }
        );
    });

    //cssのルーティング
    app.get("/styles/main.css", function(req, res){
        console.log(color.yellow + "+++ /styles/main.css start" + color.reset);
        fs.readFile(
            "./styles/main.css",
            function (err, data) {
                if (err) {
                    // とりあえずconsole.logでログを残す
                    // エラーが出たらnodeは死ぬのでendする
                    console.log(color.red + "/styles/main.css error - fs.readFile" + color.reset);
                    console.log(err+"\n");
                    res.writeHead(500);
                    res.end("Server error : " + err);
                }
                // HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
                res.writeHead(200, {"Content-Type": "text/css; charset=UTF-8"});
                res.end(data);
                console.log(color.green + "+++ /styles/main.css res.send succsess!" + color.reset);

            }
        );
    });

    //jsのルーティング
    app.get("/scripts/app.js", function(req, res){
        console.log(color.yellow + "+++ /scripts/app.js start" + color.reset);
        fs.readFile(
            "./scripts/app.js",
            function (err, data) {
                if (err) {
                    // とりあえずconsole.logでログを残す
                    // エラーが出たらnodeは死ぬのでendする
                    console.log(color.red + "/scripts/app.js error - fs.readFile" + color.reset);
                    console.log(err+"\n");
                    res.writeHead(500);
                    res.end("Server error : " + err);
                }
                // HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
                res.writeHead(200, {"Content-Type": "text/javascript; charset=UTF-8"});
                res.end(data);
                console.log(color.green + "+++ /scripts/app.js res.send succsess!" + color.reset);
            }
        );
    });

    //venderのルーティング
    app.get("/scripts/vendor.js", function(req, res){
        console.log(color.yellow + "+++ /scripts/vendor.js start" + color.reset);
        fs.readFile(
            "./scripts/vendor.js",
            function (err, data) {
                if (err) {
                    // とりあえずconsole.logでログを残す
                    // エラーが出たらnodeは死ぬのでendする
                    console.log(color.red + "/scripts/vendor.js error - fs.readFile" + color.reset);
                    console.log(err+"\n");
                    res.writeHead(500);
                    res.end("Server error : " + err);
                }
                // HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
                res.writeHead(200, {"Content-Type": "text/javascript; charset=UTF-8"});
                res.end(data);
                console.log(color.green + "+++ /scripts/vendor.js res.send succsess!" + color.reset);
            }
        );
    });

    //indexのルーティング
    app.get("/", function(req, res){
        console.log(color.yellow + "+++ / start" + color.reset);
        fs.readFile(
            "./index.html",
            function (err, data) {
                if (err) {
                    // とりあえずconsole.logでログを残す
                    // エラーが出たらnodeは死ぬのでendする
                    console.log(color.red + "/ error - fs.readFile" + color.reset);
                    console.log(err+"\n");
                    res.writeHead(500);
                    res.end("Server error : " + err);
                }
                // HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
                res.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
                res.end(data);
                console.log(color.green + "+++ / res.send succsess!" + color.reset);
            }
        );
    });

}

