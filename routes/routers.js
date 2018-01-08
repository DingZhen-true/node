/**
 * Created by ajiao on 2017/12/28.
 */

// TODO 引入router
var router = require('express').Router();
var db = require('../dao/db.js');
var fs = require('fs');

router.post('/login',function(req,res,next){
    var userName = req.body.userName;
    var passWord = req.body.passWord;
    console.log(userName,passWord);
    //TODO 判断用户名是否存在
    var doc = db.findUser(userName,loginHandler);
    // TODO 处理业务逻辑
   function loginHandler(err,doc){
        // TODO 错误优先
        if(err){
            res.send('网络错误！！！');
        }else{
            if(doc){
                // TODO 密码匹配
                if(doc.passWord === passWord){
                    //var str = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Title</title><style>div {padding: 0; margin: 0;}.container {width: 200px;height: 200px;background-color: rgba(255, 0, 0, 0.3);margin: 100px auto 0;}</style></head><body><div class="container"> ' + doc.name + '</div></body></html>';
                    // TODO 记录日志
                    var logPath = '../log/loginLog.txt';
                    var time = new Date();
                    var data =  doc.name + '在时间为：' + time.toLocaleString() +'登录成功！！！\n'
                    fs.writeFile(logPath,data,{flag:'a'},function(err){
                        if(err){
                            console.log(err);
                        }else{
                            console.log('记录完毕');
                        }
                    });
                    // TODO 当登录成功后 展示个人待办事宜列表
                     var userId = doc._id;
                     global.userId = userId;
                     console.log(userId);
                     // TODO 渲染页面
                     indexPage(userId,res);
                }else{
                    res.send('用户名或者密码错误！！');
                }
            }else{
                res.send('<a href="/gotoRegister">请去注册！！！</a>');
            }
        }
    }
});

// TODO 跳转到注册页面
router.get('/gotoRegister',function(req,res,next){
    res.redirect('register.html')
});

router.post('/register',function(req,res,next){
    // TODO 获取页面参数
    var userInfo = {
         userName : req.body.userName,
         passWord : req.body.passWord,
         email : req.body.email,
         phone : req.body.phone,
         age : req.body.age,
         sex : req.body.sex
    }
    console.log(userInfo)
    //TODO 判断用户名是否存在
    var doc = db.findUser(req.body.userName,registerHandler);
    // TODO 验证用户是否存现在（用回调与数据库做交互）
    function registerHandler(err,doc) {
        if(err){
            res.send('网络错误！！！');
        }else{
            if(doc){
                // TODO 用户已存在
                res.send('此用户已存在！！！');
            }else{
                // TODO 无此用户 可以正常添加
                var re = db.addUser(userInfo,addUserHandler);
                function addUserHandler(err,doc) {
                   if(err){
                       res.send('网络错误！！！');
                   }else{
                       // TODO 记日志
                       var logPath = '../log/regiterLog.txt';
                       var time = new Date();
                       var data =  doc.userName + '在时间为：' + time.toLocaleString() +'注册成功！！！\n'
                       fs.writeFile(logPath,data,{flag:'a'},function(err){
                           if(err){
                               console.log(err);
                           }else{
                               console.log('记录完毕');
                           }
                       });
                       res.send('<a href="/login.html">点我登录！！！</a>');
                   }
                }
            }
        }
    }

})
// TODO 添加一条数据
router.post('/addItem',function(req,res,next){
    var title = req.body.title;
    var userId = global.userId;
    console.log(title,userId);
    // 调用DB 层  添加数据
    var itemInfo = {
        title: title,
        userId:userId
    }
    db.addItems(itemInfo,addItemsHandler);
    function addItemsHandler(err,doc){
        if(err){
            res.send('网络错误！！！');
        }else{
           // TODO 如果添加成功 立刻刷新页面
            indexPage(userId,res);
        }
    }

});
module.exports = router;

// TODO 根据用户id 查询待办事项列表
function indexPage(userId,res) {
    db.findItemsByUserId(userId,function (err,docs) {
        if(err){
            res.send('网络错误！！！')
        }else{
            var obj ={items:docs}
            // TODO 渲染页面
            res.render('item_list.ejs',obj);
        }
    })

}

