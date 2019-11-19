// pages/my-evaluation/my-evaluation.js
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
  },
  getList() {
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
      url: 'v1.personal/myevaluation',
      loading: false,
      data: {
        page: this.data.page
      }
    }, {
      success: (res) => {
        this.data.page++;
        let temp = app.processImg(res.data.data);
        this.data.list.push(...temp);

        this.setData({
          list: this.data.list
        })
      },
      complete: (res) => {
        app.http.complete(this, res, app);
      }
    });
  },
  open(e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let status = e.currentTarget.dataset.status;
    if(status == -1) {
      wx.navigateTo({
        url: '/pages/buy1/buy1?id=' + id + '&name=' + name,
      })
      return false;
    }
    app.http.$ajax({
      url: 'v1.evaluation/getresult',
      data: {
        id: id
      },
      loading: '正在加载测评'
    }, {
      success: (res) => {
        wx.navigateTo({
          url: '/pages/evalution-answer/answer?url=' + encodeURIComponent(res.data.url)
        })

        // if(res.data.status != 5) {
        //   wx.navigateTo({
        //     url: '/pages/evalution-answer/answer?data=' + data,
        //   })
        // } else {
        //   wx.navigateTo({
        //     url: '/pages/result/answer?data=' + data,
        //   })
        // }
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
    this.getList();
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