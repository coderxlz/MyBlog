$('#log').on('click',function(e){
    e.preventDefault()
    const getData = {}
    let len = $('input').length
    //获取表单参数，作为ajax提交数据
    for(let i = 0;i<len;i++){
      getData[$('input')[i].name] = $('input')[i].value
    }
    console.log(getData)
    $.ajax({
      url:'/login',
      type:'post',
      data:getData,
      dataType:'text',
      success(res){
        console.log(res)
        switch(Number(res)){
          case -1: res = '服务器繁忙！';break
          case 0: 
            res = '登录成功'
            window.location.replace('/');break
          case 3: 
            res = '邮箱或密码错误'
            $('#inputPassword').val('');break
          case 4: res = '用户名不存在'
            $('#inputEmail').val('')      
            $('#inputPassword').val('');break
        }
        $('#msg')[0].innerHTML = res
        $('.toast')[0].style.visibility = 'visible'
        
        setTimeout(() => {
          $('.toast')[0].style.visibility = 'hidden'
        }, 2000);
      }
    })
  })