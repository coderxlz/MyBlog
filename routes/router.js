const express = require('express')
const router = new express()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')

//导入用户集和操作api
const User = require('../models/user')

//配置body-parser
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
router.use(bodyParser.json())

//配置express-art-template
router.engine('html', require('express-art-template'));

//配置express-session
router.use(session({
	//配置加密字符串，它会在原来字符串上拼接上这个字符串加密
	//目的是进一步加强安全性，防止客户端伪造
	secret:'coderxlz',
	
	resave:false,
	
	//当属性值为true时，表示无论你是否使用Session，都默认给你分配一把钥匙(Cookie)
	saveUninitialized:true
}))

//渲染主页
router.get('/',function(req,res,next){
    // res.set('views',path.join(__dirname,'views/layout'))
    res.render('index.html',{
        user:req.session.user
    })
})

//渲染登录页面
router.get('/login',function(req,res,next){
    res.render('login.html')
})

//提交并验证登录信息
router.post('/login',function(req,res,next){
    User.checkPass(req.body,function (info_code,data) { 
        if(info_code === 0){
            req.session.user = data
        }
        //向客户端响应信息码
        res.send(String(info_code))
     })
})

//渲染注册页面
router.get('/register',function(req,res,next){
    res.render('register.html')
})

//提交注册信息
router.post('/register',function(req,res,next){
    User.addUser(req.body,function(info_code,data){
        //当登录成功时，保存Session数据
        if(info_code === 0){
            req.session.user = data
        }
        res.send(String(info_code))
    })
    
})

//用户退出
router.get('/logout',function(req,res,next){
    //清除登录状态session，重定向到登录页面
    req.session.user = null
    res.redirect('/login')
})


router.use('/public',express.static('./public'))
router.use('/node_modules',express.static('./node_modules'))

module.exports = router