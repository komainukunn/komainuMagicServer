module.exports = function(app,mongoose,color){

    //データベースの設定
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

    //index
    app.get("/account/category/api/",apiLoginCheck,function(req,res){
        console.log(color.yellow + "--- /account/category/api/ start" + color.reset);
        var sendJson =[];
        var categoryNames = [];//カテゴリーを入れる

        //カテゴリーを検索
        Category.find({}, function(err, cats){
            if (err) { 
                sendJson = {result:"error",message:"カテゴリーを検索できませんでした"};
                res.send(sendJson);
                console.log(sendJson);
                console.log(color.red + "/account/category/api/ error - category.find" + color.reset);
                console.log(err+"\n");
                return;
            }
            //カテゴリーの名前を入れ込む
            for(var i=0;i<cats.length;i++){
                categoryNames.push(cats[i].categoryName);
            }
            sendJson = {
                result : "success",
                categoryNames:categoryNames
            };
            res.send(sendJson);
            console.log(sendJson);
            console.log(color.green + "--- /account/api/category/api/ res.send succsess!" + color.reset);
            return;
        })
    });

    //create
    //もしかしたらカテゴリー一覧を返す必要がないかも
    app.get("/account/category/api/create",apiLoginCheck,function(req,res){
        console.log(color.yellow + "--- /account/api/category/api/create start" + color.reset);
        var sendJson =[];
        var catName = req.query.categoryName; 
        console.log("req.query.categoryName --> "+req.query.categoryName);

        var categoryNames = [];//受け取ったカテゴリーを入れる
        
        var category = new Category();
        category.categoryName = catName; 

        //カテゴリーを検索
        Category.find({categoryName:catName}, function(err, cats){
            //既存だったらそのままにしておく
            if(cats != ""){
                Category.find({}, function(err, cats){
                    for(var i=0;i<cats.length;i++){
                        categoryNames.push(cats[i].categoryName);
                    }
                    sendJson = {result:"error",
                        message:"既存のカテゴリーです",
                        "categoryNames":categoryNames 
                    };
                    res.send(sendJson);
                    console.log(sendJson);
                    console.log(color.green + "--- /account/api/category/api/create res.send succsess!" + color.reset);
                    return;
                });
            //新規だったら登録する
            }else{
                category.save(function(err) {
                    if (err) { 
                        sendJson = {result:"error",message:"カテゴリーを保存できませんでした"};
                        res.send(sendJson);
                        console.log(sendJson);
                        console.log(color.red + "/account/api/category/api/create error - category.find" + color.reset);
                        console.log(err+"\n");
                        return;
                    }

                    Category.find({}, function(err, cats){
                        for(var i=0;i<cats.length;i++){
                            categoryNames.push(cats[i].categoryName);
                        }
                        sendJson = {result:"success",
                            "categoryNames":categoryNames
                        };
                        res.send(sendJson);
                        console.log(sendJson);
                        console.log(color.green + "--- /account/api/category/api/create res.send succsess!" + color.reset);
                        return;
                    });
                });
            }
        });

    });


    //delete
    app.get("/account/category/api/delete",apiLoginCheck,function(req,res){
        console.log(color.yellow + "--- /account/api/category/api/delete start" + color.reset);
        var sendJson =[];
        console.log("req.query.categoryName --> "+req.query.categoryName);

        if(!req.query.categoryName){
            sendJson = {result:"error",message:"カテゴリーの名前をうけとれませんでした"};
            res.send(sendJson);
            console.log(color.red + "/account/api/delete error - req.query.categoryName" + color.reset);
            console.log(sendJson);
            return;
        };

        var catName = req.query.categoryName; 
    
        //削除するカテゴリーが登録されているか見る
        Category.find({categoryName:catName},function(err,data){
            if(data==""){
                sendJson = {result:"error",message:"登録されていないカテゴリーです"};
                res.send(sendJson);
                console.log(color.red + "/account/category/api/delete error - req.query.categoryName" + color.reset);
                console.log(sendJson);
                return;
            };
            //登録されていたら記事との関連を削除
            Article_Category.remove({ category_id: data[0]._id }, function(err) {
                if (err) { 
                    sendJson = {result:"error",message:"記事との関連を削除できませんでした"};
                    res.send(sendJson);
                    console.log(sendJson);
                    console.log(color.red + "/account/category/api/delete error - article_category.remove" + color.reset);
                    console.log(err+"\n");
                    return ;
                }
                //うけとったカテゴリーを削除
                Category.remove({ categoryName:catName }, function(err) {
                    if (err) { 
                        sendJson = {result:"error",message:"記事との関連を削除できませんでした"};
                        res.send(sendJson);
                        console.log(sendJson);
                        console.log(color.red + "/account/category/api/delete error - category.remove" + color.reset);
                        console.log(err+"\n");
                        return ;
                    }
                    var categoryNames = [];
                    Category.find({}, function(err, cats){
                        if (err) { 
                            sendJson = {result:"error",message:"記事をみつけられませんでした"};
                            res.send(sendJson);
                            console.log(sendJson);
                            console.log(color.red + "/account/category/api/delete error - category.remove" + color.reset);
                            console.log(err+"\n");
                            return ;
                        }
                        for(var i=0;i<cats.length;i++){
                            categoryNames.push(cats[i].categoryName);
                        }
                        sendJson = {result:"success",
                            "categoryNames":categoryNames
                        };
                        res.send(sendJson);
                        console.log(sendJson);
                        console.log(color.green + "--- /account/category/api/delete res.send succsess!" + color.reset);
                        return;
                    })
                });
            });
        });
    });


};
