module.exports = function(mongoose){
    //テーブルのスキーマ
    var mongoURL = process.env.MONGOLAB_URI || "mongodb://localhost/komainukunndb";
    var Schema   = mongoose.Schema;

    /*  Articleテーブル
     *
     *  _id   : 主キー
     *  title : タイトル
     *  text  : 記事の中身
     *  data  : 日付け
     */
    
    var ArticleTable = new Schema({
        title:{type: String, required: true},
        text:{type: String, required: true},
        date:{type: Date, default: Date.now}
    });

    /*  Categoryテーブル
     *
     *  _id          : 主キー 
     *  CategoryName : カテゴリーの名前
     */

    var CategoryTable = new Schema({
        categoryName:{type: String, required: true, unique: true}
    });


    /* ArticleCategoryテーブル
     *
     * _id         : 主キー
     * article_id  : 記事のid
     * category_id : カテゴリーのid
     */

    var ArticleCategoryTable = new Schema({
        article_id:{type: String, required:true},
        category_id:{type: String, required:true}
    });


    /* Accountテーブル
     *
     * _id      : 主キー
     * id       : ユーザーid
     * password : パスワード
     *
     */

    var AccountTable = new Schema({
        id:{type: String, required:true ,unique: true},
        password:{type: String,required:true}
    });

    //テーブルを作成
    mongoose.model("Articles",ArticleTable);
    mongoose.model("Categories",CategoryTable);
    mongoose.model("ArticlesCategories",ArticleCategoryTable);
    mongoose.model("Accounts",AccountTable);

    //接続
    mongoose.connect(mongoURL);
}
