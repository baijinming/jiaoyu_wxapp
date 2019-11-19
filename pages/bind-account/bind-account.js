var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: '',
    password: '',
    bindOk: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 更新账号
  getAccount(e) {
    this.setData({
      account: e.detail.value
    })
    this.isGoBind()
  },
  // 更新密码
  getPassword(e) {
    this.setData({
      password: e.detail.value
    })
    this.isGoBind()
  },
  isGoBind() {
    this.setData({
      bindOk: this.data.account != '' && this.data.password != '' ? true : false
    })
  },

  // 账号绑定
  bindAccount() {
    if(!this.data.bindOk){
      return;
    }
    app.http.$ajax({
      url: 'user/bindinfo',
      data: {
        account: this.data.account,
        password: this.data.password,
        platform: 'wxapp',
        open_id: app.globalData.auth.openid
      },
      loading: '绑定账号中...'
    }, {
      success(res) {
        if(res.code == 1) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success'
          })
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          },1000)
        }
      }
    })
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
  onShareAppMessage: function () {

  }
})