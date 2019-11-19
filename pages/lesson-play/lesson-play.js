// pages/lesson-detail/lesson-detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    info: {},
    chapter: [],
    is_buy: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.chapter_id,
      course_id: options.course_id
    })
    this.getDetail();
    this.getChapter();
    this.getInfo();
  },
  getDetail() {
    app.http.$ajax({
      url: 'v1.learn/getChapterDetail',
      data: {
        id: this.data.id
      }
    }, {
      success: (res) => {
        this.setData({
          info: app.processImg(res.data, 'file')
        })
      }
    })
  },
  // 获取章节列表
  getChapter() {
    app.http.$ajax({
      url: 'v1.learn/getChapter',
      data: {
        id: this.data.course_id
      },
      loading: '加载章节...'
    }, {
        success: (res) => {
          this.setData({
            chapter: app.processImg(res.data)
          })
        }
      })
  },
  getInfo() {
    app.http.$ajax({
      url: 'v1.learn/getCourse',
      data: {
        course_id: this.data.course_id
      },
      loading: '...'
    }, {
        success: (res) => {
          this.setData({
            is_buy: res.data.is_buy
          })
        }
      });
  },

  switch(e) {
    let id = e.currentTarget.dataset.id;
    let is_audition = e.currentTarget.dataset.is_audition;
    if (this.data.is_buy == 0 && is_audition != 2) {
      return app.info('请先购买课程');
    }
    this.setData({
      id: id
    })
    this.getDetail()
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