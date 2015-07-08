module.exports = function(app,mongoose,color){
    //データベースの設定
    var Article = mongoose.model("Articles");
    var Category = mongoose.model("Categories");
    var Article_Category = mongoose.model("ArticlesCategories");

    //最新記事をとってくるapi
    app.get("/api/new-article", function(req, res){

        console.log(color.yellow + "--- /api/new-article start" + color.reset);

        var catItem = [];   //カテゴリーを収納するための配列
        var cnt = 0;        //コールバック同期用カウンター
        var sendJson = [];  //送る用データ

        //最新の記事をソートして取り出す
        Article.find({},{},{sort:{date: -1},limit:1}, function(err, art){
            if(err){
                sendJson = { result : "error",message : "記事の検索に失敗しました"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/api/new-article error - Article.find" + color.reset);
                console.log(err+"\n");
                return ;
            }
            if(art==""){
                sendJson = { result : "error",message : "記事が投稿されていません"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/api/new-article error - Article.find" + color.reset);
                console.log(err+"\n");
                return ;
            }
            //記事のidから対応してるカテゴリーのidを検索
            Article_Category.find({ "article_id":art[0]._id }, function(err, docs) {
                if(err){
                    sendJson = { result : "error",message : "記事に関連したカテゴリーを検索できませんでした"};
                    res.send(sendJson);
                    console.log(sendJson);
                    console.log(color.red + "/api/new-article error - Article_Category.find" + color.reset);
                    console.log(err+"\n");
                    return ;
                }
                if(docs==""){
                    sendJson = { 
                        result : "success",
                        title : art[0].title,
                        text : art[0].text,
                        date : art[0].date
                    };
                    res.send(sendJson);
                    console.log(sendJson);
                    console.log(color.red + "/api/new-article error - Article_Category.find" + color.reset);
                    console.log(err+"\n");
                    return ;
                }

                //カテゴリーの数分のfor文を回す
                for (var i=0, size=docs.length; i<size; ++i) {

                    //カテゴリーの名前を取得
                    Category.find({"_id":docs[i].category_id},function(err, cats) {
                        if(err){
                            sendJson = { result : "error",message : "カテゴリーの名前を検索できませんでした"};
                            res.send(sendJson);
                            console.log(sendJson);
                            console.log(color.red + "/api/new-article error - Category.find" + color.reset);
                            console.log(err+"\n");
                            return ;
                        }
                        if(cats == []){
                            sendJson = { result : "error",message : "カテゴリーの名前を検索できませんでした"};
                            res.send(sendJson);
                            console.log(sendJson);
                            console.log(color.red + "/api/new-article error - Category.find" + color.reset);
                            console.log(err+"\n");
                            return ;
                        }

                        //配列に入れていく
                        catItem.push(cats[0].categoryName);
                        //入れたらカウンターをあげる
                        cnt++;

                        //カウンターが数に達したら、データーを送る
                        if(cnt >= size){
                            sendJson = {
                                result: "success",
                                title : art[0].title,
                                text : art[0].text,
                                categories:catItem,
                                date : art[0].date
                            }; 
                            res.send(sendJson);
                            console.log(sendJson);
                            console.log(color.green + "--- /api/new-articl res.send succsess!" + color.reset);
                        }
                    }) 
                }
            });
        });
    });//indexはここまで
    
}

