const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
Page({

  data: {
    tabIdx: 0,
    course_id: 0,
    info: {},
    chapter: [],
    live: false,
    showPopup: false,
    showCouponList: false,
    couponMsg: null,
    pay_price: 0,
    couponHeight: 0,
    danFile: null
  },
  onLoad: function(options) {
  
    if (app.util.isUndefined(options.course_id) || options.course_id == 0) {
      app.error('课程id未传递', function() {
        wx.navigateBack({
          delta: 1
        })
      })

      return;
    }
    this.setData({
      course_id: options.course_id,
      live: options.live ? true : false,
    })
    this.getInfo();
    if (this.data.live) {
      this.getLiveChapter();
    } else {
      this.getChapter();
    }
  },
  //发起http请求 获取课程信息
  getInfo() {
    app.http.$ajax({
      url: 'v1.learn/getCourse',
      data: {
        course_id: this.data.course_id
      },
      loading: '正在加载课程...'
    }, {
      success: (res) => {
        res.data.images_arr = [res.data.image]
        app.processImg(res.data.images_arr);
        WxParse.wxParse('introduce', 'html', res.data.content, this, 5);
        this.setData({
          info: res.data,
          pay_price: res.data.price,
          danFile: res.data.file ? res.data.file : null
        })
      }
    });
  },
  // 展示支付弹窗
  showPopup() {
    this.setData({
      showPopup: true
    })
  },
  // 关闭支付弹窗
  closePopup() {
    this.setData({
      showPopup: false
    })
  },
  //打开优惠券列表
  showCoupon() {
    let that = this;
    app.http.$ajax({
      url: 'v1.personal/mycoupon',
      data: {
        status: 1,
        page: 1
      },
      loading: false
    }, {
      success(res) {
        that.setData({
          couponList: res.data.data,
          showCouponList: true,
          couponHeight: wx.getSystemInfoSync().windowHeight * 0.7
        })
      }
    })
  },
  // 关闭优惠卷列表
  closeCoupon() {
    this.setData({
      showCouponList: false
    })
  },
  // 选择优惠券
  chooseCoupon(e) {
    let index = e.currentTarget.dataset.index;
    if (parseInt(this.data.couponList[index].use_amount) > parseInt(this.data.info.price)) {
      wx.showToast({
        title: '未达到满减金额',
        icon: 'none'
      })
      return;
    }
    this.setData({
      couponMsg: this.data.couponList[index],
      showCouponList: false,
      pay_price: parseInt(this.data.info.price) - parseInt(this.data.couponList[index].money)
    })
  },
  // 支付
  buy() {
    let that = this;
    let form = {
      id: this.data.course_id
    };
    if (this.data.couponMsg) {
      form.coupon_id = this.data.couponMsg.id
    }
    app.http.$ajax({
      url: 'v1.pay/pay',
      data: form
    }, {
      success: (res) => {
        let payData = JSON.parse(res.data);
        wx.requestPayment({
          ...payData,
          'success': function(res) {
            app.success('支付成功', function() {
              that.setData({
                info: {},
                showPopup: false,
                showCouponList: false
              })
              //刷新当前页面
              that.getInfo();
            })
          },
          'fail': function(res) {
            app.error('支付失败')
          }
        })
      },
      fail: (res) => {

      }
    })
  },
  open(e) {
    if (this.data.danFile) {
      wx.navigateTo({
        url: '/pages/series-play/series-play?file=' + this.data.danFile + '&course_id=' + this.data.course_id,
      })
      return
    }
    let chapter_id = e.currentTarget.dataset.chapter_id;
    let is_audition = e.currentTarget.dataset.is_audition;
    let is_movie = e.currentTarget.dataset.is_movie;
    let index = e.currentTarget.dataset.index;
    if (this.data.info.is_buy != 1 && is_audition != 2) {
      return app.info('请先购买课程');
    }
    if (is_movie == 2) {
      wx.navigateTo({
        url: '/pages/series-play/series-play?chapter_id=' + chapter_id + '&course_id=' + this.data.course_id + '&index=' + index,
      });
    } else {
      wx.navigateTo({
        url: '/pages/lesson-play/lesson-play?chapter_id=' + chapter_id + '&course_id=' + this.data.course_id,
      });
    }
  },
  getChapter() {
    app.http.$ajax({
      url: 'v1.learn/getChapter',
      data: {
        id: this.data.course_id
      },
      loading: '加载目录...'
    }, {
      success: (res) => {
        this.setData({
          chapter: app.processImg(res.data)
        })
      }
    })
  },
  handleTab(e) {
    let idx = e.currentTarget.dataset.idx;
    this.setData({
      tabIdx: idx
    })
  },
  // 获取直播章节目录
  getLiveChapter() {
    app.http.$ajax({
      url: 'v1.chat/getChatInfo',
      data: {
        course_id: this.data.course_id
      },
      loading: '加载目录...'
    }, {
        success: (res) => {
          this.setData({
            live_chapter: app.processImg(res.data, 'video')
          })
        }
      })
  },

  // 点赞/取消
  addThumb() {
    let that = this;
    if (this.data.info.is_buy != 1) {
      return app.info('请先购买课程');
    }
    let form = {
      course_id: this.data.info.id,
      type: this.data.info.is_thumbs == 1 ? 2 : 1
    }
    app.http.$ajax({
      url: 'v1.Learn/thumbsDo',
      data: form,
      loading: '...'
    }, {
      success: (res) => {
        WxParse.wxParse('introduce', 'html', '', this, 5);
        that.getInfo()
      }
    })
  }
})