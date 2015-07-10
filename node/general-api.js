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
    });// /api/new-articleはここまで
    

    //カテゴリー一覧をとってくる
    app.get("/api/categories", function(req, res){
        console.log(color.yellow + "--- /api/categories" + color.reset);
        var categoryNames = [];//受け取ったカテゴリーを入れる

        var cnt = 0; //同期用カウンター
        //カテゴリーと記事の関連の数を検索
        Article_Category.find({}, function(err, docs){
            if (err) { 
                sendJson = {result:"error",message:"カテゴリーを検索できませんでした"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/api/categories error - article_category.find" + color.reset);
                console.log(err+"\n");
                return;
            }
            if(docs==""){
                sendJson = {
                        result : "success",
                        categoryNames:categoryNames
                    };
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/api/categories error - article_category.find" + color.reset);
                return;
            }
            for(var i=0, size=docs.length;i<size;i++){
                //対応したカテゴリーを検索
                Category.find({_id : docs[i].category_id},function(err,cat){
                    //カテゴリーの名前を入れ込む
                    categoryNames.push(cat[0].categoryName);
                    cnt ++;
                    if(cnt>=size){
                        sendJson = {
                            result : "success",
                            categoryNames:categoryNames
                        };
                        res.send(sendJson);
                        console.log(sendJson);
                        console.log(color.green + "--- /api/categories res.send succsess!" + color.reset);
                        return;
                    }
                });
            };
        })
    });
   
    //日付けを全部とってくる
    app.get("/api/dates", function(req, res){
        console.log(color.yellow + "--- /api/dates start" + color.reset);
        var artDates = [];   //日付け

        var sendJson = [];

        //記事の検索
        Article.find({},{},{sort:{date: -1}}, function(err, arts){
            if(err){
                sendJson = { result : "error", message : "記事の検索に失敗しました"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/api/dates error - Article.find" + color.reset);
                console.log(err+"\n");
                return ;
            }
            if(arts == ""){
                sendJson = { result : "error",message : "記事が投稿されていません"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/api/dates error - Article.find" + color.reset);
                console.log(err+"\n");
                return ;
            }
            //配列の記事を入れていく
            for(var i=0,size=arts.length; i<size; i++){
                artDates.push(arts[i].date);
            }
            sendJson = {
                result : "success",
                dates:artDates
            };
            
            res.send(sendJson);
            console.log(sendJson);
            console.log(color.green + "--- /api/dates res.send succsess!" + color.reset);
        });
    });
   
    //指定されたカテゴリーの一覧をとってくる
    app.get("/api/category",function(req,res){
        console.log(color.yellow + "--- /api/category start" + color.reset);
        var sendJson = [];
        //もしもカテゴリーの名前がおくられてなかった場合
        if(!req.query.categoryName){
            sendJson = { result : "error",message : "カテゴリーのidが送信されていません"};
            res.send(sendJson);
            console.log(sendJson);
            console.log(color.red + "/api/category error - no req.query.categoryName" + color.reset);
            return;
        };

        console.log("req.query.categoryName --> " + req.query.categoryName);
        var catName = req.query.categoryName;

        var art_ids = [];   //idをいれる
        var artTitles = []; //タイトルを入れる
        var artDates = [];  //日付けを入れる

        var cnt = 0;
        Category.find({categoryName:catName},function(err,data){
            if (err) { 
                sendJson = {result:"error",message:"カテゴリーを検索できませんでした"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/api/category error - category.find" + color.reset);
                console.log(err+"\n");
                return;
            }
            //カテゴリがなかった場合 
            if(data==""){
                sendJson = {result:"error",message:"登録されていないカテゴリーです"};
                res.send(sendJson);
                console.log(color.red + "/api/category error - req.query.categoryName" + color.reset);
                console.log(sendJson);
                return;
            }
            Article_Category.find({category_id:data[0]._id},function(err,docs){
                if (err) { 
                    sendJson = {result:"error",message:"関連した記事を検索できませんでした"};
                    res.send(sendJson);
                    console.log(sendJson);
                    console.log(color.red + "/api/category error - category.find" + color.reset);
                    console.log(err+"\n");
                    return;
                }
                if(docs==""){
                    sendJson = {result:"success",message:"このタグの記事は未登録です"};
                    res.send(sendJson);
                    console.log(sendJson);
                    console.log(color.red + "/api/category error - req.query.categoryName" + color.reset);
                    return;
                }
                for(var i=0, size=docs.length;i<size;i++){
                    Article.find({_id : docs[i].article_id},{},{sort:{date: -1}},function(err,arts){
                        
                        
                        art_ids.push(arts[0]._id);
                        artTitles.push(arts[0].title);
                        artDates.push(arts[0].date);
                        cnt++;
                        if(cnt>=size){
                            sendJson = {
                                result:"succsess",
                                _ids:art_ids,
                                titles:artTitles, 
                                dates:artDates
                            }; 
                            res.send(sendJson);
                            console.log(sendJson);
                            console.log(color.green + "--- /api/category res.send succsess!" + color.reset);
                            return;
                        }
                    });
                }
            });
        });
    });

    //指定された日付けの一覧をとってくる
    app.get("/api/date",function(req,res){

        console.log(color.yellow + "--- /api/date start" + color.reset);
        var sendJson = [];

        //もしも日付けがおくられてなかった場合
        if(!req.query.date){
            sendJson = { result : "error",message : "日付けが送信されていません"};
            res.send(sendJson);
            console.log(sendJson);
            console.log(color.red + "/api/date error - no req.query.categoryName" + color.reset);
            return;
        };
        if(!req.query.date.match(/^[0-9][0-9][0-9][0-9]-[0-9][0-9]$/)){
            sendJson = { result : "error",message : "日付けのフォーマットがおかしいです"};
            res.send(sendJson);
            console.log(sendJson);
            console.log(color.red + "/api/date error - no req.query.date.match" + color.reset);
            return;
        };

        console.log("req.query.date --> " + req.query.date);
        var date = req.query.date;

        var art_ids = [];   //idをいれる
        var artTitles = []; //タイトルを入れる
        var artDates = [];  //日付けを入れる

        var firstDate = new Date(date+"-01").toISOString(); //月の最初  
        var lastDate = new Date(date+"-31").toISOString(); //月の最後
        //クエリ
        var query = {date : {"$gte" : firstDate , "$lte" : lastDate}};
        
        Article.find(query,{},{sort:{date: -1}},function(err,arts){
            if (err) { 
                sendJson = {result:"error",message:"記事を検索できませんでした"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/api/date error - Article.find" + color.reset);
                console.log(err+"\n");
                return;
            }
            if(arts==""){
                sendJson = {result:"success",message:"この月は更新がありません"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.green + "--- /api/date res.send succsess!" + color.reset);
                return;
            }
            for(var i=0;i<arts.length;i++){
                art_ids.push(arts[i]._id);
                artTitles.push(arts[i].title);
                artDates.push(arts[i].date);
                if(i>=arts.length-1){
                    sendJson = {
                        result:"success",
                        _ids:art_ids,
                        titles:artTitles, 
                        dates:artDates
                    };
                    res.send(sendJson);
                    console.log(sendJson);
                    console.log(color.green + "--- /api/date res.send succsess!" + color.reset);
                    return;
                }
            }
        });

    });





    //show 指定されたidの記事をとってくる
    app.get("/api/show",function(req,res){
        console.log(color.yellow + "--- /api/show start" + color.reset);
        var sendJson = [];
        //もしもidがおくられてなかった場合
        if(!req.query.id){
            sendJson = { result : "error",message : "記事のidが送信されていません"};
            res.send(sendJson);
            console.log(sendJson);
            console.log(color.red + "/api/show error - no req.query.id" + color.reset);
            return;
        };
        console.log("req.query.id --> " + req.query.id);
        
        var art_id =req.query.id ? req.query.id :"";//記事のIDを入れる
        var catItem = [];        //カテゴリーを入れる配列
        var cnt = 0;             //コールバックで同期処理するためのカウンター


        //パラメーターの記事を取得
        Article.find({_id:art_id},{},{sort:{date: -1},limit:1}, function(err, art){

            if(err){
                sendJson = { result : "error",message : "記事の検索に失敗しました"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "api/show error - Article.find" + color.reset);
                console.log(err+"\n");
                return ;
            }
            if(art==""){
                sendJson = { result : "error",message : "記事が投稿されていません"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/api/show error - Article.find" + color.reset);
                console.log(err+"\n");
                return ;
            }

            //記事のidから対応してるカテゴリーのidを検索
            Article_Category.find({ article_id:art[0]._id }, function(err, docs) {
                
                if(err){
                    sendJson = { result : "error",message : "記事に関連したカテゴリーを検索できませんでした"};
                    res.send(sendJson);
                    console.log(sendJson);
                    console.log(color.red + "/api/show error - Article_Category.find" + color.reset);
                    console.log(err+"\n");
                    return ;
                }
                if(docs==""){
                    sendJson = { 
                        _id : art[0]._id,
                        result : "success",
                        title : art[0].title,
                        text : art[0].text,
                        date : art[0].date
                    };
                    res.send(sendJson);
                    console.log(sendJson);
                    console.log(color.green + "--- /api/show res.send succsess!" + color.reset);
                    return ;
                }
                //カテゴリーの数 for文を回す
                for (var i=0, size=docs.length; i<size; ++i) {
                    //カテゴリーの名前を検索するクエリ
                    Category.find({"_id":docs[i].category_id},function(err, cats) {

                        if(err){
                            sendJson = { result : "error",message : "カテゴリーの名前を検索できませんでした"};
                            res.send(sendJson);
                            console.log(sendJson);
                            console.log(color.red + "/api/show error - Category.find" + color.reset);
                            console.log(err+"\n");
                            return ;
                        }
                        if(cats == []){
                            sendJson = { result : "error",message : "カテゴリーの名前を検索できませんでした"};
                            res.send(sendJson);
                            console.log(sendJson);
                            console.log(color.red + "/api/show error - Category.find" + color.reset);
                            console.log(err+"\n");
                            return ;
                        }

                        catItem.push(cats[0].categoryName);
                        cnt++;
                        if(cnt >= size){
                            sendJson = {
                                result:"success",
                                _id : art[0]._id,
                                title : art[0].title,
                                text : art[0].text,
                                categories:catItem,
                                date : art[0].date
                            } 
                            res.send(sendJson);
                            console.log(sendJson);
                            console.log(color.green + "--- /api/show res.send succsess!" + color.reset);
                            return;
                        }
                    }) 
                }
            });
        });
    });//ここまでshow

};

