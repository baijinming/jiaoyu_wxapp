const app = getApp();
Page({
  data: {
    menu: [{
      icon: '../../images/icon-1.png',
      text: '家长课程',
      url: '/pages/lesson-h/lesson-h?type=1&title=家长课程'
    }, {
      icon: '../../images/icon-2.png',
      text: '教职课程',
      url: '/pages/lesson-h/lesson-h?type=2&title=教职课程'
    }, {
      icon: '../../images/icon-3.png',
      text: '学生课程',
      url: '/pages/lesson-h/lesson-h?type=3&title=学生课程'
    }, {
      icon: '../../images/icon-4.png',
      text: '家长必修课',
      url: '/pages/lesson-h/lesson-h?type=4&title=家长必修课'
    }, {
      icon: '../../images/icon-5.png',
      text: '专题课程',
      url: '/pages/lesson-v/lesson-v?type=specials&title=专题课程'
    }, {
      icon: '../../images/icon-6.png',
      text: '大咖课程',
      url: '/pages/lesson-v/lesson-v?type=teacher&title=大咖课程'

    }, {
      icon: '../../images/icon-7.png',
      text: '家长问答',
      url: '/pages/question/question?title=家长问答'
    }, {
      icon: '../../images/icon-8.png',
      text: '实践活动',
      url: '/pages/activity/activity?title=实践活动'
    }, ],
    tabIdx: 0,
    banner: [],
    hot: [],
    specials: [],
    minPic: [
      {
        imageurl: '../../images/banner2.png'
      }
    ]
  },

  onLoad: function(options) {
    this.getIndex();
  },
  // 获取优惠券列表
  getCoupon() {
    let that = this;
    wx.request({
      url: app.globalData.apiurl + 'v1.personal/coupon',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'http-token': app.globalData.auth.token
      },  
      success(res) {
        console.log(res)
        that.setData({
          couponList: res.data.data
        })
      }
    })
  },
  getIndex() {
    let that = this;
    app.http.$ajax({
      url: 'v1.index/index',
      loading: "努力加载中..."
    }, {
      success(res) {
        let specials = res.data.specials;
        specials.forEach(function(item, index) {
          app.processImg(item.courses.data)
        });
        that.setData({
          banner: app.processImg(res.data.pic.data, 'imageurl'),
          // minPic: app.processImg(res.data.mid_pic.data, 'imageurl'),
          hot: app.processImg(res.data.hot.data),
          specials: specials
        })
        console.log(that.data.banner)
      }
    })
  },
  hotmore() {
    wx.navigateTo({
      url: '/pages/hot-course/hot-course',
    })
  },
  handleSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  handleMessage() {
    wx.navigateTo({
      url: '/pages/message/message',
    })
  },

  handleMenu(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  handleTab(e) {
    console.log(e.currentTarget.dataset.idx)
    this.setData({
      tabIdx: e.currentTarget.dataset.idx
    })
  },

  open(event) {
    let course_id = event.currentTarget.dataset.course_id;
    wx.navigateTo({
      url: '/pages/lesson-detail/lesson-detail?course_id=' + course_id,
    })
  },

  onPullDownRefresh: function() {
    this.getIndex()
  },
  onShow() {
    this.getCoupon();
  }
})