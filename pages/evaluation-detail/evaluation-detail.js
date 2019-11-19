const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
Page({

  data: {
    id: 0,
    info: {}
  },
  onLoad: function(options) {
    this.data.id = options.id;
    this.getInfo();
  },
  getInfo() {
    app.http.$ajax({
      url: 'v1.evaluation/detail',
      data: {
        id: this.data.id
      }
    }, {
      success: (res) => {
        WxParse.wxParse('introduce', 'html', res.data.content, this, 5);
        this.setData({
          info: app.processImg(res.data)
        });
      }
    })
  },
  buy() {
    let that = this;
    if (this.data.info.id == undefined) {
      return;
    }
    app.http.$ajax({
      url: 'v1.evaluation/add',
      data: {
        evalutation_id: that.data.info.id
      },
      loading: '正在提交订单...'
    }, {
      success: (res) => {
        let payData = JSON.parse(res.data);
        wx.requestPayment({
          ...payData,
          'success': function(res) {
            wx.showToast({
              title: '购买成功,请前往我的测评开始测评',
              icon: 'none'
            })
            this.getInfo();
          },
          'fail': function(res) {
            app.error('支付失败')
          }
        })
      },
      fail: (res) => {

      }
    })
    // let obj = Object.assign(this.data.info, {
    //   content: ''
    // })
    // let str = JSON.stringify(obj);
    // wx.navigateTo({
    //   url: '/pages/buy1/buy1?info=' + str,
    // })
  }
})