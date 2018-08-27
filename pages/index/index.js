//index.js
var util = require('../../utils/md5.js') 
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
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
    showChangyi: false,
    toBottom: false,
    showShare: false,
    maskHidden: false,
    name: "",
    touxiang: "",
    code: "E7A93C"
  },
  closeShare() {
    this.setData({
      showShare: false
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
  submit() {//用户提交了选择的位置区域
    this.setData({
      showPicker: false
    })
    this.setData({
      selectArea: true,
      showChangyi: true
    })
  },
  toBottom() {
    this.setData({
      toBottom: true
    })
  },
  support() {
    this.setData({
      showChangyi: false
    })
    //发起网略请求
    console.log(this.data.quyu)
    console.log(this.data.zhenjie)
    if(true) {//投票成功
      console.log("投票成功了~~~")
      this.setData({
        showShare: true
      })

    } else {
      console.log("投票失败了~~~")

    }
  },
  //事件处理函数
  intoButtonTap: function() {
    wx.login({
      success: res => {
        console.log(res)
        app.globalData.code = res.code
        //取出本地存储用户信息，解决需要每次进入小程序弹框获取用户信息
        app.globalData.userInfo = wx.getStorageSync('userInfo')
        //wx.getuserinfo接口不再支持
        let that = this;
        wx.getSetting({
          success: (res) => {
            //判断用户已经授权。不需要弹框
            if (res.authSetting['scope.userInfo']) {
              that.setData({
                showModel: false
              })
              //用户已经授权
              //将code提交给后台 检查是否已经投票成功 如果成功就生成海报 如果没投票就弹出选择呢区域的模态框              
              console.log("开始将code提交给后台")
              console.log(app.globalData )
              let hash = util.hexMD5("saoheichue2018abc")
              console.log(hash)
              //向后台传输数据
              //that.getOP(app.globalData.userInfo)
              wx.showToast({
                title: '验证中...',
                icon: 'loading',
                duration: 1000
              });
              if(true) {
                console.log("已经投票了")
                //生成海报
                that.setData({
                  showShare: true
                })
              } else {
                that.setData({
                  showPicker: true
                })
              }
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
          title: '系统提示:网络错误',
          icon: 'warn',
          duration: 1500,
        })
      }
    })
  },

  //获取用户授权信息新接口
  agreeGetUser: function (e) {
    console.log(e)
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
    console.log(321)
    this.setData({//让用户选择区域
      showPicker: true
    })
  },

  getOP: function (res) {//提交用户信息 获取用户id
    let that = this
    let userInfo = res
    app.globalData.userInfo = userInfo
    wx.request({
      url: 'https://xcx.xiancaijun.cn/tigerlogin/tgLogin',
      method: 'post',
      data: {
        "code": app.globalData.code,
        'userInfo': userInfo
      },
      success: function (res) {
        if (res.data.respcode == '0') {
          app.globalData.userId = res.data.uid
          app.globalData.keys = res.data.keys
          app.globalData.access = res.data.access
          that.getBook()
          that.shareInfo()
          if (that.data.cid) {
            wx.navigateTo({
              url: '/pages/course/course?cid=' + that.data.cid
            })
          }
        } else if (res.data.respcode == '15') {
          wx.hideLoading()
          wx.showToast({
            title: '没有授权，不能进入小程序',
            icon: 'none',
            duration: 2000
          })
        }

      }
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      console.log(4)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      console.log(5)
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(6)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      console.log(7)
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },



 
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#ffe200")
    context.fillRect(0, 0, 375, 667)
    var path = "../../imgs/gobg.png";
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, 0, 0, 375, 183);
    var path1 = that.data.touxiang;
    console.log(path1, "path1")
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    var path2 = "../../imgs/tap.png";
    var path3 = "../../imgs/heise.png";
    var path4 = "../../imgs/wenziBg.png";
    var path5 = "/imgs/wenxin.png";
    //context.drawImage(path2, 126, 186, 120, 120);
    //不知道是什么原因，手机环境能正常显示
    // context.save(); // 保存当前context的状态

    var name = that.data.name;
    //绘制名字
    context.setFontSize(24);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText(name, 185, 340);
    context.stroke();
    //绘制一起吃面标语
    context.setFontSize(14);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText("邀请你一起去吃面", 185, 370);
    context.stroke();
    //绘制验证码背景
    context.drawImage(path3, 48, 390, 280, 84);
    //绘制code码
    context.setFontSize(40);
    context.setFillStyle('#ffe200');
    context.setTextAlign('center');
    context.fillText(that.data.code, 185, 435);
    context.stroke();
    //绘制左下角文字背景图
    context.drawImage(path4, 25, 520, 184, 82);
    context.setFontSize(12);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("进入小程序输入朋友的邀请", 35, 540);
    context.stroke();
    context.setFontSize(12);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("码，朋友和你各自获得通用", 35, 560);
    context.stroke();
    context.setFontSize(12);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("优惠券1张哦~", 35, 580);
    context.stroke();
    //绘制右下角扫码提示语
    context.drawImage(path5, 248, 578, 90, 25);
    //绘制头像
    context.arc(186, 246, 50, 0, 2 * Math.PI) //画出圆
    context.strokeStyle = "#ffe200";
    context.clip(); //裁剪上面的圆形
    context.drawImage(path1, 136, 196, 100, 100); // 在刚刚裁剪的园上画图
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
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }
    })
  },
  //点击生成
  quanShare: function (e) {
    var that = this;
    this.setData({
      showShare: false
    });
    wx.showToast({
      title: '生成海报中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
      });
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo, "huoqudao le ")
        this.setData({
          name: res.userInfo.nickName,
        })
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
      }
    })
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
      title: "清城向黑恶势力说不",
      success: function (res) {
        console.log(res, "转发成功")
      },
      fail: function (res) {
        console.log(res, "转发失败")
      }
    }
  }


})
