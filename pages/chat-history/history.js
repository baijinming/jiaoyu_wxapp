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
  onLoad: function (options) {
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
      url: 'v1.chat/pageHistory',
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //下拉刷新 重置数据
    this.data.page = 1;
    this.data.is_pull = true;
    this.getList(true);
  },
  open(e) {
    let id = e.currentTarget.dataset.learn_course_id;
    wx.navigateTo({
      url: '/pages/lesson-detail/lesson-detail?course_id=' + id,
    })
  }
})