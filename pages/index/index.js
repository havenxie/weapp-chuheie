//index.js
var util = require('../../utils/md5.js') 
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModel: false,
    showPicker: false,
    select: false,
    selectArea: false,
    quyu: "",
    showQuyuItems: false,
    zhenjie: "",
    showZhenjieItems: false,
    myName : "",
    phoneNum: "",
    showNext: false,
    showChangyi: false,
    toBottom: false,
    showShare: false,
    showLeaveModel: false,
    leaveTxt: "",
    submitLeave: false,
    maskHidden: false,
    name: "",
    touxiang: "",
    indexCode: 0,
    joined: 0,
    openid: '',
    animationMiddleHeaderItem: {}
  },
  showLeaveModel() {
    this.setData({
      showLeaveModel: true,
      leaveTxt: ''//清空上次留言
    })
  },
  textInput(e) {
    this.setData({
      leaveTxt: e.detail.value
    })
    if(e.detail.value != "") {
      this.setData({
        submitLeave: true
      })
    } else {
      this.setData({
        submitLeave: false
      })  
    }
  },
  leaveBtn() {
    this.closeShare()
    //需要发起网络请求
    console.log(this.data.leaveTxt)
    this.postZhufu(this.data.leaveTxt)
  },
  closeShare() {
    this.setData({
      showShare: false,
      showLeaveModel: false
    })
  },
  closeQuyu() {//点击右上角关闭按钮
    this.setData({
      showPicker: false
    })
  },
  bindShowQuyuItems() {//点击区域显示下拉列表
    if(this.data.showQuyuItems == false) {
      this.setData({
        showQuyuItems: true
      })
    } else {
      this.setData({
        showQuyuItems: false
      })
    }
  },
  bindShowZhenjieItems() {//点击街道显示下拉列表
    if (this.data.showZhenjieItems == false) {
      this.setData({
        showZhenjieItems: true
      })
    } else {
      this.setData({
        showZhenjieItems: false
      })
    }
  },
  selectQuyu(e) {//选择区域
    var name = e.currentTarget.dataset.name
    this.setData({
      quyu: name,
      showQuyuItems: false
    })
  },
  selectZhenjie(e) {//选择街镇
    var name = e.currentTarget.dataset.name
    this.setData({
      zhenjie: name,
      showZhenjieItems: false
    })
  },
  inputName(e) {
    this.setData({
      myName: e.detail.value
    })
  },
  inputNum(e) {
    var num = e.detail.value
    if(num.length == 11) {
      this.setData({
        showNext: true,
        phoneNum: num
      })
    } else {
      this.setData({
        showNext: false,
      })
    }
  },
  submit() {//用户点击了下一步
    this.setData({
      showPicker: false
    })
    this.setData({
      selectArea: true,
      showChangyi: true,
      toBottom: false
    })
  },
  toBottom() {
    this.setData({
      toBottom: true
    })
  },
  support() {//用户提交信息参与活动
  //应该在这里进行数据的有效性验证
    this.setData({
      showChangyi: false
    })
    this.postArea()
  },
  postZhufu: function (msg) {
    wx.request({
      url: 'https://qx.sj0763.com/2018/wxapp_saoheichue/api.addmsg.php',
      method: 'GET',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: {
        "msg": msg,
        "openid": this.data.openid
      },
      success: function (res) {
        // console.log(res)
        if (res.data.code == 200 && res.data.desc == "ok") {
          wx.showToast({
            icon: 'success',
            title: '留言提交成功~',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '留言提交失败',
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          icon: 'none',
          title: '留言提交失败，重启一下试试呗~',
        })
      }
    })   
  },
  postArea: function (res) {//提交用户信息 获取用户id
    let that = this
    let thisaddr = this.data.zhenjie
    let name = this.data.myName
    let nickname = this.data.name
    let thisopenid = this.data.openid
    let phonenum = this.data.phoneNum
    // console.log("saoheichue2018")
    // console.log(thisaddr)
    // console.log("傻瓜")
    // console.log(nickname)
    // console.log(thisopenid)
    // console.log("18056113210")
    //  console.log("saoheichue2018" + thisaddr + name + nickname + thisopenid + phonenum)
    // console.log(util.hexMD5("saoheichue2018" + thisaddr + name + nickname + thisopenid + phonenum))
    wx.request({
      url: 'https://qx.sj0763.com/2018/wxapp_saoheichue/api.updateinfo.php',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: {
        "addr": thisaddr,
        "name": name,
        "nick": nickname,
        "openid": thisopenid,
        "phone": phonenum,
        "hash": util.hexMD5("saoheichue2018" + thisaddr + name + nickname + thisopenid + phonenum)
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          // console.log('提交用户信息成功')
          var zhongjiang = res.data.winning
          if (zhongjiang == '0') {//很遗憾没有中奖
            wx.showModal({
              content: '很遗憾，您没有中奖~~ 快去点击心跳分享给好友吧~',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#333',
              success: function (res) {
                if (res.confirm) {
                  // console.log('用户点击了确定')
                } else {
                  // console.log('用户点击了取消')
                }
              }
            })
          }
          else {//小伙伴中奖了    
            wx.showModal({
              content: '你是幸运女神附体了吗？你中了：' + zhongjiang + ' 我们之后会短信联系你， 快去点击心跳分享给好友吧~',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#333',
              success: function (res) {
                if (res.confirm) {
                  // console.log('用户点击确定');
                } else {
                  // console.log('用户点击取消')
                }
              }
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '网络访问出错了呢，重启一下试一试吧~',
          })
        }
      }
    })
  },
  getOP: function (res) {//提交用户信息 获取用户id
    let that = this
    let userInfo = res
    app.globalData.userInfo = userInfo
    // console.log(app.globalData.code)
    // console.log(util.hexMD5(app.globalData.code))
    wx.showToast({
      title: '验证中...',
      icon: 'loading',
      duration: 1000,
    });
    wx.request({
      url: 'https://qx.sj0763.com/2018/wxapp_saoheichue/api.reg2.php',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        "code": app.globalData.code,
        "hash": util.hexMD5("saoheichue2018" + app.globalData.code)
      },
      success: function (res) {
        // console.log(res)
        if (res.data.code == 200) {
          that.setData({
            joined: res.data.joined,
            indexCode: res.data.id,
            openid: res.data.openid
          })
          if (res.data.joined == 1) {//已经投票过了
            that.setData({//生成海报
              showShare: true
            })
          } else {//还没有投票
            that.setData({//需要打开获取信息的弹窗
              showPicker: true
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '网络访问出错了呢，重启一下试一试吧~',
          })
        }
      }
    })
  },
  //事件处理函数
  intoButtonTap: function() {
    wx.login({
      success: res => {
        // console.log(res)
        app.globalData.code = res.code
        //取出本地存储用户信息，解决需要每次进入小程序弹框获取用户信息
        app.globalData.userInfo = wx.getStorageSync('userInfo')
        //wx.getuserinfo接口不再支持
        let that = this;
        wx.getSetting({
          success: (res) => {
            //判断用户已经授权。不需要弹框
            if (res.authSetting['scope.userInfo']) {
              //将code提交给后台 检查是否已经投票成功 如果成功就生成海报 如果没投票就弹出选择呢区域的模态框              
              that.getOP(app.globalData.userInfo)
            } else {//没有授权需要弹框
              this.setData({
                showModel: true
              })
              return
            }
          },
          fail: function () {
            wx.showToast({
              title: '系统提示:网络错误',
              icon: 'warn',
              duration: 1500,
            })
          }
        })
      },
      fail: function () {
        wx.showToast({
          title: '接口调用失败，请联系电话18056113210',
          icon: 'warn',
          duration: 1500,
        })
      }
    })
  },

  //获取用户授权信息新接口
  agreeGetUser: function (e) {
    // console.log(e)
    this.setData({
      showModel: false
    })
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {//用户点击了没有设置
      return
    }
    try {//设置用户信息本地存储
      wx.setStorageSync('userInfo', e.detail.userInfo)
    } catch (e) {
      wx.showToast({
        title: '系统提示:网络错误',
        icon: 'warn',
        duration: 1500,
      })
    }

  },

  onLoad: function () {
    var circleCount = 0;
    // 心跳的动画部分开始---------------------------------------------------------------------
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 1000,    // 以毫秒为单位  
      timingFunction: 'ease',
      delay: 20,
      transformOrigin: '50% 80% 0',
      success: function (res) {
      }
    });
    setInterval(function () {
      if (circleCount % 2 == 0) {
        this.animationMiddleHeaderItem.scale(1.2).step();
      } else {
        this.animationMiddleHeaderItem.scale(0.8).step();
      }

      this.setData({
        animationMiddleHeaderItem: this.animationMiddleHeaderItem.export()  //输出动画
      });

      circleCount++;
      if (circleCount == 1000) {
        circleCount = 0;
      }
    }.bind(this), 1000);
    //心跳的动画部分结束---------------------------------------------------------------------

    this.myGetUserSQInfo({
      success: res => {
        // console.log(1)
      },
      fail: res => {
        // console.log(2)
      }
    })
  },
  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //随机数生成器
  RandomNumBoth: function (Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
  },
  //点击生成海报
  quanShare: function (e) {
    var that = this;
    this.setData({
      showShare: false
    });
    wx.showToast({
      title: '获取专属祝福语并生成海报中...',
      icon: 'loading',
      duration: 2000
    });
    wx.request({
      url: 'https://qx.sj0763.com/2018/wxapp_saoheichue/api.newyear_toast.php',
      method: 'GET',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      success: function (res) {
        // console.log(res)
        if (res.data.code == 200 && res.data.toasts.length > 0) {
          // console.log('成功获取到数据')
          // for(let i = 0; i < res.data.toasts.length; i++) {
          //   console.log(res.data.toasts[i])
          // }
          let randnum = that.RandomNumBoth(0, res.data.toasts.length - 1)
          let randStr = res.data.toasts[randnum]
          let strs = []
          let i = Math.floor(randStr.length / 18)
          let j = randStr.length % 18
          let t = 0
          for(t = 0; t < i; t+=1) {
            strs.push(randStr.substring(t*18, (t + 1) * 18))
          }
          strs.push(randStr.substring(t * 18))
          setTimeout(function () {
            wx.hideToast()
            that.createNewImg(t+1, strs);
            that.setData({
              maskHidden: true
            });
          }, 2000)
        } else {
          console.log("接口访问错误~")
        }
      }
    })
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function (t, strs) {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#ffffff")
    context.fillRect(0, 0, 850, 1024)
    var path = "../../imgs/savepng.png";
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, -0, 0, 850, 1024);
    // var path1 = that.data.touxiang;
    // console.log(path1, "path1")
    // //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    // var path2 = "../../imgs/tap.png";
    // var path3 = "../../imgs/index.png";
    // var path4 = "../../imgs/wenziBg.png";

    //context.drawImage(path2, 126, 186, 120, 120);
    //不知道是什么原因，手机环境能正常显示
    // context.save(); // 保存当前context的状态

    // var name = that.data.name;
    // //绘制名字
    // context.setFontSize(24);
    // context.setFillStyle('#333333');
    // context.setTextAlign('center');
    // context.fillText(name, 185, 340);
    // context.stroke();
    // //绘制一起吃面标语
    // context.setFontSize(14);
    // context.setFillStyle('#333333');
    // context.setTextAlign('center');
    // context.fillText("邀请你一起去吃面", 185, 370);
    // context.stroke();
    //绘制验证码背景
    //context.drawImage(path3, 54, 300, 280, 64);
    //绘制code码
    context.setFontSize(42);
    context.setFillStyle('#fff');
    context.setTextAlign('center');
    context.fillText("您的专属祝福语：", 425, 420);
    context.stroke();

    for(let m = 0; m < t; m++) {
      context.setFontSize(42);
      context.setFillStyle('#fff');
      context.setTextAlign('center');
      context.fillText(strs[m], 425, 500 + m * 50);
      context.stroke();
    }

    // //绘制左下角文字背景图
    // context.drawImage(path4, 25, 520, 184, 82);
    // context.setFontSize(12);
    // context.setFillStyle('#333');
    // context.setTextAlign('left');
    // context.fillText("进入小程序输入朋友的邀请", 35, 540);
    // context.stroke();
    // context.setFontSize(12);
    // context.setFillStyle('#333');
    // context.setTextAlign('left');
    // context.fillText("码，朋友和你各自获得通用", 35, 560);
    // context.stroke();
    // context.setFontSize(12);
    // context.setFillStyle('#333');
    // context.setTextAlign('left');
    // context.fillText("优惠券1张哦~", 35, 580);
    // context.stroke();
    // //绘制右下角扫码提示语
    // context.drawImage(path5, 248, 578, 90, 25);
    //绘制头像
    // context.arc(186, 246, 50, 0, 2 * Math.PI) //画出圆
    // context.strokeStyle = "#ffe200";
    // context.clip(); //裁剪上面的圆形
    // context.drawImage(path1, 136, 196, 100, 100); // 在刚刚裁剪的园上画图
     context.draw();

    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  hideCanvas: function() {
    this.setData({
      maskHidden: false
    })
  },
  //点击保存到相册
  baocun: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {//用户点击确定
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, 
          fail: function (res) {}
        })
      },
      fail: function() {
        wx.showToast({
          icon: 'none',
          title: '图片保存失败了，很遗憾，再试一次吧！',
        })
        that.setData({
          maskHidden: false,
          canvasHidden: false
        })
      }

    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },



myGetUserSQInfo({ success,  fail}){
  var that = this;
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            app.globalData.userInfo = res.userInfo
            // console.log(app.globalData.userInfo)

            this.setData({
              name: res.userInfo.nickName,
            })
            typeof success == 'function' && success(that);
            /*
            wx.downloadFile({
              url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
              success: function (res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                  console.log(res, "reererererer")
                  that.setData({
                    touxiang: res.tempFilePath
                  })
                }
              }
            })
            */
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            // if (this.userInfoReadyCallback) {
            //   this.userInfoReadyCallback(res)
            // }
          }
        })
       
        // return 'ok'
      } else {
        // console.log('用户没有授权')
        this.setData({//让用户选择区域
          showModel: true
        })
        // return 'fail'
        typeof fail == 'function' && fail(that);
      }
    }
  })
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: "美好清城 新年快乐",
      imageUrl: "../../imgs/share.png",
      success: function (res) {
        wx.showToast({
          title: '转发成功！',
        })
      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: '转发失败',
        })
      }
    }
  }


})
