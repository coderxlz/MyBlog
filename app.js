const express = require('express')
const app = new express()
const router = require('./routes/router')

app.use(router)

app.listen(3000,function(){
    console.log('the server is running at port 3000')
})