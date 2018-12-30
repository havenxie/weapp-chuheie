//app.js
App({
  onLaunch: function () {

    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // console.log(1)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        
        // if(res.code) {
        //   wx.getUserInfo({
        //     success: function (res) {
        //       var objz = {};
        //       objz.avatarUrl = res.userInfo.avatarUrl;
        //       objz.nickName = res.userInfo.nickName;
        //       //console.log(objz);
        //       wx.setStorageSync('userInfo', objz);//存储userInfo
        //     }
        //   });
        //   var d = that.globalData;//这里存储了appid、secret、token串 
        //   console.log(d)
        //   var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';  
        //   wx.request({
        //     url: l,
        //     data: {},
        //     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
        //     // header: {}, // 设置请求的 header  
        //     success: function (res) {
        //       var obj = {};
        //       obj.openid = res.data.openid;
        //       obj.expires_in = Date.now() + res.data.expires_in;
        //       console.log(obj);
        //       wx.setStorageSync('user', obj);//存储openid  
        //     }
        //   });

        // }
        // else {
        //   console.log('获取用户登录态失败！' + res.errMsg)
        // }  

      }
    })
   // 获取用户信息
    // var that = this
    // wx.getSetting({
    //   success: (res) => {
    //     if (res.authSetting['scope.userInfo']) {
    //       console.log('用户已经授权')
    //       //取出本地存储用户信息，解决需要每次进入小程序弹框获取用户信息
    //       app.globalData.userInfo = wx.getStorageSync('userInfo')
    //       console.log(app.globalData.userInfo)

    //       //that.getOP(app.globalData.userInfo)
    //       //判断用户是否已经投票开始...
    //       //判断用户是否已经投票结束...

    //     } else {
    //       console.log('用户没有授权')
    //       this.setData({
    //         showModel: true
    //       })
    //       return
    //     }
    //   }
    // }),

  },
  globalData: {
    userInfo: null,
    appid: 'wxe40cefa733a8fc4d',//appid需自己提供，此处的appid我随机编写
    secret: 'e0dassdadef2424234209bwqqweqw123ccqwa',//secret需自己提供，此处的secret我随机编写
  }
})