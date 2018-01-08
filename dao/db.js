/**
 * Created by ajiao on 2017/12/28.
 */
////////////////////    数据库    //////////////////////////////
var mongoose = require('mongoose');
//连接
mongoose.connect("mongodb://localhost:27017/todo1703");
// 3. 获得连接
var connection = mongoose.connection;
// error
connection.on('error', function(err){
    console.error(err);
});
// open
connection.on('open', function() {
    // we're connected!
    console.log('we are connected!');
});


///////////////////////////    用户的操作     ///////////////////////////
var UserSchema = new mongoose.Schema({
    userName:String,
    passWord:String,
    email:String,
    phone:Number,
    age:Number,
    sex:Number,// TODO 1.男  2. 女  3.人妖
    state:{type:Number,default:1}  // TODO 1.未完成  2.已完成
});


//module
var UserModel = mongoose.model('user', UserSchema);

// var UserModel1 = {
//     userName:'s1',
//     passWord:'s1',
//     email:'s1',
//     phone:1,
//     age:1,
//     sex:1,// TODO 1.男  2. 女  3.人妖
//     state:1  // TODO 1.未完成  2.已完成
// };
// UserModel.create(UserModel1,function (err,doc) {
//     if(err){
//         console.log(err)
//     }else{
//         console.log(doc)
//     }
// })
// TODO 通过用户名查询信息
function findUser(userName, callback){

    UserModel.findOne({userName: userName}, function (err, doc) {
        if(err){
            // console.error(err);
            callback(err);
        }else {
            // callback(doc);
            callback(null, doc);    //错误优先
        }
    });

}
// TODO 暴露  findUser
exports.findUser = findUser;

// TODO 添加用户
function addUser(userInfo, callback) {
    var obj = {
        userName: userInfo.userName,
        passWord: userInfo.passWord,
        email: userInfo.email,
        phone:userInfo.phone,
        age:userInfo.age,
        sex:userInfo.sex,
        state:1
    };
    console.log(obj);
    UserModel.create(obj, function (err, doc) {
        if(err){
            callback(err);
        }else {
            console.log(doc);
            callback(null, doc);
        }
    });
}
// TODO 暴露 addUser
exports.addUser = addUser;


////////////////////////////////////////////// TODO 待办事宜管理/////////////////////////////////////////////////
// TODO 创建Schema 表头
var ItemsSchema = new mongoose.Schema({
    userID:String,
    title:String,
    createTime:{type:Date},
    state:{type:Number,default:1}  // TODO 1.未完成  2.已完成
});

// TODO 创建collections
//module
var ItemsModel = mongoose.model('item', ItemsSchema);

var ItemsModel1 = {
    userID:'5a4a5124311bc2005e5af9ad',
    title:'去s1面试',
    createTime:new Date(),
    state:1  // TODO 1.未完成  2.已完成
};
ItemsModel.create(ItemsModel1,function (err,doc) {
    if(err){
        console.log(err)
    }else{
        console.log(doc)
    }
})
// TODO Items添加数据
function addItems(itemInfo,callback){

    var obj = {
        userID:itemInfo.userId,
        title:itemInfo.title,
        createTime:new Date(),
        state:1  // TODO 1.未完成  2.已完成
    }

    console.log(obj);
    ItemsModel.create(obj, function (err, doc) {
        if(err){
            console.log(err);
            callback(err);
        }else {
            console.log(doc);
            callback(null, doc);
        }
    });
}
exports.addItems = addItems;
// TODO Items删除数据
function deleteItems(itemID,callback){
    ItemsModel.findById(itemID,function(err,doc){
        if(err){
            callback(err);
        }else{
            // TODO 如果查到数据将其删除
           doc.remove(function (err,doc) {
               if(err){
                   callback(err);
               }else{
                   callback(doc);
               }
           })
        }
    })
}
exports.deleteItems = deleteItems;
// TODO 跳转到修改页面
function gotoUpdatePage(itemID,callback){
    ItemsModel.findById(itemID,function(err,doc){
        if(err){
            callback(err);
        }else{
            callback(null,doc);
        }
    })
}
exports.gotoUpdatePage = gotoUpdatePage;
// TODO Items修改数据
function updateItems(itemInfo){
    ItemsModel.findById(itemID,function(err,doc){
        if(err){
            callback(err);
        }else{
            if(doc){
                doc.tilte =  itemInfo.tilte;
                ItemsModel.save(doc,function (err,doc) {
                    if(err){
                        callback(err);
                    }else{
                        callback(null,doc);
                    }
                })
            }
        }
    })
}
exports.updateItems = updateItems;
// TODO 根据用户id 查询待办事项列表
function findItemsByUserId(userId,callback) {
    ItemsModel.find({userID:userId},function(err,docs){
        if(err){
            callback(err);
        }else{
            console.log(docs);
            callback(null,docs);

        }
    })
}

exports.findItemsByUserId = findItemsByUserId;