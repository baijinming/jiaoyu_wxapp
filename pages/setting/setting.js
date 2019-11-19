// pages/setting/setting.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  open(e) {
    let type = e.currentTarget.dataset.type;
    if (type == 2) {
      return wx.navigateTo({
        url: '/pages/suggession/suggession',
      });
    }
    if (type == 3) {
      return wx.navigateTo({
        url: '/pages/bind-account/bind-account',
      });
    }
    wx.navigateTo({
      url: '/pages/rich-text/rich-text?type=' + type,
    })
  },
  logout() {
    app.globalData.auth = {}
    app.success('成功退出', function() {
      setTimeout(function() {
        wx.redirectTo({
          url: '/pages/choose-school/index2'
        })
      }, 1000)
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