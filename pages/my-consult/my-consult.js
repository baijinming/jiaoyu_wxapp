// pages/my-consult/my-consult.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    tip: '上拉加载',
    is_pull: true,
    page: 1,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: ((res.windowHeight * 750) / res.windowWidth)
        })
      }
    });
    this.getList();
  },
  getList(down = false) {
    let that = this;
    if (this.data.is_pull != true) {
      return;
    }
    this.data.is_pull = false;
    this.setData({
      loading: true,
      tip: '正在加载',
    })
    app.http.$ajax({
      url: 'v1.personal/myconsult',
      loading: false,
      data: {
        page: this.data.page
      },
      loading: false
    }, {
      success: (res) => {
        this.data.page++;
        let temp = app.processImg(res.data.data);
        if (down == false) {
          this.data.list.push(...temp);
        } else {
          this.data.list = temp;
        }
        this.setData({
          list: this.data.list
        })

      },
      complete: (res) => {
        app.http.complete(this, res, app);
      }
    });
  },
  // 进入直播间
  intoConsult(e) {
    let index = e.currentTarget.dataset.index;
    let data = Object.assign(this.data.list[index], {
      content: ''
    })
    let info = JSON.stringify(data);
    wx.navigateTo({
      url: '/pages/chat/consult?info=' + info,
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
    //下拉刷新 重置数据
    this.data.page = 1;
    this.data.is_pull = true;
    this.getList(true);
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