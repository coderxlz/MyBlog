const mongoose = require('mongoose')
const md5 = require('blueimp-md5')

//连接数据库
mongoose.connect('mongodb://localhost/myblog')

//设置数据格式
const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    nickname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    //用来表示用户的状态
    //0表示无权限限制
    //1表示不可以评论
    //2表示不可以登录
    status:{
        type:Number,
        required:true,
        default:1,
        enum:[0,1,2]
    },
    //用户性别，-1表示保密
    gender:{
        type:Number,
        enum:[-1,0,1],
        default:-1
    },
    //用户头像
    avatar:{
        type:String,
        default:'/public/img/avatar-default.png'
    },
    //用户创建时间
    create_time:{
        type:Date,
        default:Date.now
    },
    //最后修改时间
    last_modified_time:{
        type:Date,
        //此处不能调用方法，当new model时，该方法会自动被调用并将返回值设为默认值
        default:Date.now
    },
    //用户生日
    birthday:{
        type:String,
        default:''
    },
    //介绍信息
    bio:{
        type:String,
        default:'该用户很懒，什么也没有写'
    }
})

//创建模型
const User = mongoose.model('Users',userSchema)

const user1 = new User({
    email:'xulishuaige@qq.com',
    nickname:'coderxlz',
    //对密码进行两次md5加密，防止暴力破解
    password:md5(md5('123456')),
    gender:1
})

//检查唯一性
function checkUnique(user,callback){

    new Promise((resolve,reject) => {
        User.findOne({email:user.email},function(err,data){
            if(err){
                callback(-1)
            }else if(data){
                callback(1)
            }else{
                resolve(0)
            }
        })
    }).then(res => {
        User.findOne({nickname:user.nickname},function(err,data){
            if(err){
                callback(-1)
            }else if(data){
                callback(2)
            }else{
                callback(res)
            }
        })
    })
}




module.exports = {
    //添加用户
    addUser:function(user,callback){
        checkUnique(user,function(err_code){
            switch(err_code){

                case -1:
                    console.log('服务器繁忙！')
                    callback(-1);break

                case 0:
                    //添加新用户
                    new User({
                        email:user.email,
                        nickname:user.nickname,
                        password:md5(md5(user.password))
                    }).save(function(err,data){
                        if(err){
                            callback(-1)
                        }else{
                            callback(0,data)
                        }
                    });break

                case 1:
                    console.log('邮箱重复')
                    callback(1);break

                case 2:
                    console.log('昵称重复')
                    callback(2);break
            }
        })
    },

    //密码校验
    checkPass(user,callback){
        User.findOne({email:user.email},function (err,data) {
            if(err){
                callback(-1)
            }else if(data){
                console.log('查询到数据：',data)
                md5(md5(user.password)===data.password)?callback(0,data):callback(3)
            }else{
                callback(4)
            }
        })
    }

}


