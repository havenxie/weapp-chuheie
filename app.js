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
        console.log(1)
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
    wx.getSetting({
      success: res => {
        console.log(2)
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          console.log(3)
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    appid: 'wxe40cefa733a8fc4d',//appid需自己提供，此处的appid我随机编写
    secret: 'e0dassdadef2424234209bwqqweqw123ccqwa',//secret需自己提供，此处的secret我随机编写
  }
})