const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
Page({

  data: {
    id: 0
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getInfo();
  },
  getInfo() {
    app.http.$ajax({
      url: 'v1.personal/couponinfo',
      data: {
        id: this.data.id
      }
    }, {
        success: (res) => {
          WxParse.wxParse('introduce', 'html', res.data.detail, this, 5);
        }
      })
  },
  // 领取优惠券
  receiveCoupon() {
    app.http.$ajax({
      url: 'v1.personal/getcoupon',
      data: {
        id: this.data.id
      }
    }, {
        success: (res) => {
          if(res.code == 1) {
            wx.showToast({
              title: '领取成功',
              icon: 'none'
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        }
      })
  }
})