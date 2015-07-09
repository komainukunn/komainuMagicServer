module.exports = function(app,mongoose,color){
    var Article = mongoose.model("Articles");
    var Category = mongoose.model("Categories");
    var Article_Category = mongoose.model("ArticlesCategories");

    //ログインページにリダイレクトさせる
    var apiLoginCheck = function(req, res, next) {
        console.log("### apiLoginCheck\nuser name --> " + req.session.user);
        var sendJson =[];
        if(req.session.user){
            next();
        }else{
            sendJson = {result:"error", message:"セッションが切れました。ログインしてください"};
            res.send(sendJson);
        }
    };

    //index 記事の一覧をとってくる
    app.get("/account/api/",apiLoginCheck,function(req,res){
        console.log(color.yellow + "--- /account/api/ start" + color.reset);
        var art_ids = [],    //記事の主キー
            artTitles = [],  //タイトル
            artDates = [];   //日付け

        var sendJson = [];

        //記事の検索
        Article.find({},{},{sort:{date: -1}}, function(err, arts){
            if(err){
                sendJson = { result : "error", message : "記事の検索に失敗しました"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/account/api/ error - Article.find" + color.reset);
                console.log(err+"\n");
                return ;
            }
            if(arts == ""){
                sendJson = { result : "error",message : "記事が投稿されていません"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/account/api/ error - Article.find" + color.reset);
                console.log(err+"\n");
                return ;
            }

            //配列の記事を入れていく
            for(var i=0,size=arts.length; i<size; i++){
                art_ids.push(arts[i]._id);
                artTitles.push(arts[i].title);
                artDates.push(arts[i].date);
                if(i>=size-1){
                    sendJson = {
                        result:"succsess",
                        _ids:art_ids,
                        titles:artTitles, 
                        dates:artDates
                    };
                    res.send(sendJson);
                    console.log(sendJson);
                    console.log(color.green + "--- /account/api/ res.send succsess!" + color.reset);
                }
            }
        })
    });

    //show 指定されたidの記事をとってくる
    app.get("/account/api/show",apiLoginCheck,function(req,res){
        console.log(color.yellow + "--- /account/api/show start" + color.reset);
        var sendJson = [];
        //もしもidがおくられてなかった場合
        if(!req.query.id){
            sendJson = { result : "error",message : "記事のidが送信されていません"};
            res.send(sendJson);
            console.log(sendJson);
            console.log(color.red + "/account/api/show error - no req.query.id" + color.reset);
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
                console.log(color.red + "account/api/show error - Article.find" + color.reset);
                console.log(err+"\n");
                return ;
            }
            if(art==""){
                sendJson = { result : "error",message : "記事が投稿されていません"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/account/api/show error - Article.find" + color.reset);
                console.log(err+"\n");
                return ;
            }

            //記事のidから対応してるカテゴリーのidを検索
            Article_Category.find({ article_id:art[0]._id }, function(err, docs) {
                if(err){
                    sendJson = { result : "error",message : "記事に関連したカテゴリーを検索できませんでした"};
                    res.send(sendJson);
                    console.log(sendJson);
                    console.log(color.red + "/account/api/show error - Article_Category.find" + color.reset);
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
                    console.log(color.green + "--- /account/api/show res.send succsess!" + color.reset);
                    return ;
                }
                //カテゴリーの数 for文を回す
                for (var i=0, size=docs.length; i<size; ++i) {

                    //カテゴリーの名前を検索するクエリ
                    Category.find({"_id":docs[i].category_id},function(err, cats) {
                        if(err){
                            
                            res.send(sendJson);
                            console.log(sendJson);
                            console.log(color.red + "/account/api/show error - Category.find" + color.reset);
                            console.log(err+"\n");

                            return ;
                        }
                        if(cats == ""){
                            sendJson = { result : "error",message : "カテゴリーの名前を検索できませんでした"};
                            res.send(sendJson);
                            console.log(sendJson);
                            console.log(color.red + "/account/api/show error - Category.find" + color.reset);
                            return ;
                        }
                        catItem.push(cats[0].categoryName);
                        cnt++;
                        if(cnt >= size){
                            sendJson = {
                                result:"success",
                                _id : art[0]._id, // idつかなわいかも
                                title : art[0].title,
                                text : art[0].text,
                                categories:catItem,
                                date : art[0].date
                            } 
                            res.send(sendJson);
                            console.log(sendJson);
                            console.log(color.green + "--- /account/api/show res.send succsess!" + color.reset);
                            return;
                        }
                    }) 
                }
            });
        });
    });

    //create
    app.post("/account/api/create",apiLoginCheck,function(req,res){
        console.log(color.yellow + "--- /account/api/create start" + color.reset);
        var sendJson = [];
        var title = req.body.title ? req.body.title : "",              //タイトル
            text = req.body.text ? req.body.text : "",                //記事
            categories = req.body.categories ? req.body.categories : ""; //カテゴリー

        console.log("title --> " + title + "\ntext --> "+text+"\ncategories --> "+categories);

        //空欄があったらエラーを返す
        if(title=="" || text==""){
                sendJson = {result:"error",message:"何か入力してください"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/account/api/create error - title==\"\" || text==\"\"" + color.reset);
                return;
        }

        //記事を保存
        var article = new Article();
        article.title  = title;
        article.text = text; 
        article.save(function(err) {
            if (err) { 
                sendJson = {result:"error",message:"記事を保存できませんでした"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/account/api/create error - article.save" + color.reset);
                console.log(err+"\n");
                return;
            }
        });

        //非同期のため、ここで完了をおくってしまう
        sendJson = {result:"success",message:"完了しました"};
        res.send(sendJson);
        console.log(sendJson);

        var cnt=0;  //同期のためのcnt
        if(categories.length <= 0){
            console.log(color.green + "--- /account/api/create res.send succsess!" + color.reset);
            return;
        }
        for(var i=0;i<categories.length;i++){
            //紐つけするカテゴリーを検索してなかったら登録
            Category.find({categoryName:categories[i]},function(err, cat){
                //あった場合
                if(cat!=""){
                    var article_category = new Article_Category();
                    article_category.article_id  = article._id;
                    article_category.category_id = cat[0]._id;
                    article_category.save(function(err) {
                        cnt++;
                        if (err) { 
                            console.log(color.red + "/account/api/create error - article_category.save" + color.reset);
                            console.log(err+"\n");
                            return;
                        }
                        if(cnt>=cat.length){
                            console.log(color.green + "--- /account/api/create res.send succsess!" + color.reset);
                            return;
                        }
                    });
                //なかった場合
                }else{
                    console.log(categoryName);
                    var category = new Category();
                    category.categoryName = categories[cnt];
                    category.save(function(err) {
                        if (err) { 
                            console.log(err+"\n");
                            console.log(color.red + "/account/api/create error - category.save" + color.reset);
                            return;
                        }
                        var article_category = new Article_Category();
                        article_category.article_id  = article._id;
                        article_category.category_id = category._id;
                        article_category.save(function(err) {
                            cnt++;
                            if (err) { 
                                console.log(color.red + "/account/api/create error - article_category.save" + color.reset);
                            }
                            if(cnt>=cat.length){
                                console.log(color.green + "--- /account/api/create res.send succsess!" + color.reset);
                            }
                        });
                    });
                }
            });
        }
    });

    //update
    app.post("/account/api/update",apiLoginCheck,function(req,res){
        console.log(color.yellow + "--- /account/api/update start" + color.reset);
        var art_id = req.body.id ? req.body.id : "",
            title = req.body.title ? req.body.title :"",
            text = req.body.text ? req.body.text :"",
            categories = req.body.categories ? req.body.categories :[];

        console.log("art_id --> "+art_id+"\ntitle --> " + title + "\ntext --> "+text+"\ncategories --> "+categories);

        //空欄があったらエラーを返す
        if(title=="" || text==""){
            sendJson = {result:"error",message:"何か入力してください"};
            res.send(sendJson);
            console.log(sendJson);
            console.log(color.red + "/account/api/create error - title==\"\" || text==\"\"" + color.reset);
            return;
        }


        //記事の更新
        Article.update({_id:art_id},{title:title,text:text},function(err){
            if (err) { 
                sendJson = {result:"error",message:"記事を保存できませんでした"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/account/api/update error - article.update" + color.reset);
                console.log(err+"\n");
                return;
            }

            //一回カテゴリーの紐つけを消す
            Article_Category.remove({ article_id:art_id }, function(err) {
                if (err) {
                    sendJson = {result:"error",message:"古い記事のカテゴリーの関連を消せませんでした"};
                    res.send(sendJson);
                    console.log(sendJson);
                    console.log(color.red + "/account/api/update error - article_category.remove" + color.reset);
                    console.log(err+"\n");
                    return;
                }

                //カテゴリーがなかったら終了
                if(categories==""){
                    sendJson = {result:"success",message:"完了しました"};
                    res.send(sendJson);
                    console.log(sendJson);
                    console.log(color.green + "--- /account/api/update res.send succsess!" + color.reset);
                    return;
                }

                //ここで一回完了を送る
                sendJson = {result:"success",message:"完了しました"};
                res.send(sendJson);
                console.log(sendJson);

                var cnt=0; //同期のためのカウンター
                for(var i=0;i<categories.length;i++){
                    //同じ名前のカテゴリーがないか検索する
                    Category.find({categoryName:categories[i]},function(err, cat){
                        //ある場合
                        if(cat!=""){
                            var article_category = new Article_Category();
                            article_category.article_id  = art_id;
                            article_category.category_id = cat[0]._id;
                            article_category.save(function(err) {
                                if (err) {
                                    console.log(color.red + "/account/api/update error - category.find" + color.reset);
                                    console.log(err+"\n");
                                    return;
                                }
                            });
                        //ない場合
                        }else{
                            var category = new Category();
                            category.categoryName = categories[cnt];
                            console.log(categoies[cnt]);
                            category.save(function(err) {
                                if (err) { 
                                    console.log(color.red + "/account/api/update error - category.save" + color.reset);
                                    console.log(err+"\n");
                                    return;
                                }
                            });
                            var article_category = new Article_Category();
                            article_category.article_id  = art_id;
                            article_category.category_id = category._id;
                            article_category.save(function(err) {
                                if (err) {
                                    console.log(color.red + "/account/api/update error - article_category.save" + color.reset);
                                    console.log(err+"\n");
                                    return;
                                }
                            });
                        }
                        if(cnt >= categories.length){
                            console.log(color.green + "--- /account/api/update res.send succsess!" + color.reset);
                            return;
                        }
                    });
                }
            });
        });
    });

    //delete
    app.get("/account/api/delete",apiLoginCheck,function(req,res){
        console.log(color.yellow + "--- /account/api/delete start" + color.reset);
       var sendJson = [];

        console.log("req.query.id --> " + req.query.id);

        if(!req.query.id){
            sendJson = {result:"error",message:"記事が指定されてません"};
            res.send(sendJson);
            console.log(color.red + "/account/api/delete error - req.query.id" + color.reset);
            console.log(sendJson);
            return;
        };

        //記事のid
        var art_id = req.query.id ? req.query.id : ""; 
        
        Article_Category.find({ article_id:art_id }, function(err, data) {
            if (err) { 
                sendJson = {result:"error",message:"記事とカテゴリーの関連を削除できませんでした"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/account/api/delete error - article_category.remove" + color.reset);
                console.log(err+"\n");
                return;
            }
            Article.remove({ _id: art_id }, function(err) {
                if (err) {
                    sendJson = {result:"error",message:"記事を削除できませんでした"};
                    res.send(sendJson);
                    console.log(sendJson);
                    console.log(color.red + "/account/api/delete error - article_category.remove" + color.reset);
                    console.log(err+"\n");
                    return;
                }
                sendJson = {result:"success",message:"完了しました"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.green + "--- /account/api/delete res.send succsess!" + color.reset);
                return;
            });
        });
    });
}
