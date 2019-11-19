// pages/advance/advance.js
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    room_id: 0,
    info: {},
    clearTimer: false,
    targetTime: 1000,
    isHost: true
  },
  enter() {

    app.http.$ajax({
      url: 'v1.chat_manager/create',
      data: {
        id: this.data.info.id
      },
      loading: '正在进入'
    }, {
      success: (res) => {
        this.setData({
          info: res.data
        })
        let data = Object.assign(this.data.info, {
          content: ''
        })
        let info = JSON.stringify(data);
        if (data.user_auth == 1 && res.data.type == 0) {
          wx.navigateTo({
            url: '/pages/before-room/before-room?info=' + info,
          })
        } else {
          wx.navigateTo({
            url: '/pages/chat/chat?info=' + info,
          })
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //this.data.room_id = options.id;
    this.data.room_id = options.id;
    this.setData({
      targetTime: options.start_time * 1000
    });
  },
  getDetail() {
    let that = this;
    app.http.$ajax({
      url: 'v1.chat/detail',
      data: {
        id: this.data.room_id
      }
    }, {
      success: (res) => {
        WxParse.wxParse('introduce', 'html', res.data.content, this, 5);
        this.setData({
          info: res.data,
          isHost: res.data.user_auth == 1 && res.data.type != 1 ? true : false
        })
      }
    })
  },
  onUnload() {
    this.setData({
      clearTimer: true
    });
  },

  open() {
    let that = this;
    app.http.$ajax({
      url: 'v1.chat/chatroomdo',
      data: {
        room_id: that.data.info.room_id,
        type: 1
      }
    }, {
        success: (res) => {
          if(res.code == 1) {
            that.enter()
          }
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getDetail();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})