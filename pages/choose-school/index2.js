var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSearch: false,
    list: [],
    value: '',
    image_url: app.http.image_url,
    org_cate_id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  search(event) {
    let that = this;
    let search = event.detail;
    if (app.util.isEmpty(search)) {
      that.setData({
        showSearch: false,
        list: [],
        org_cate_id: 0
      })
      return;
    }

    app.http.$ajax({
      url: 'v1.org/search',
      data: {
        search: search
      },
      loading: false
    }, {
        success: function (res) {
          let data = res.data;
          if (data.length > 0) {
            that.setData({
              showSearch: true,
              list: data
            })
          }
        }
      })
  },
  choose(event) {
    // let data = event.target.dataset;
    let data = event;
    let org_cate_id = data.org_cate_id
    this.setData({
      showSearch: false
    });
    app.globalData.auth.org_cate_id = org_cate_id;
    let value = data.name;
    this.setData({
      value: value,
      org_cate_id: org_cate_id
    })
    this.visitor()
  },

  tologin: function (e) {
    let that = this;

    if (this.data.value == '' && !this.data.org_cate_id) {
      app.info('请先选择单位');
      return;
    }

    if (!app.globalData.auth.open_id) {
      app.warning('请先进行微信授权', function() {
        wx.navigateTo({
          url: '/pages/choose-school/index'
        })
      })
      return;
    } else {
      wx.navigateTo({
        url: '/pages/login/login?school=' + that.data.value
      });
    }
  },
  open() {
    wx.navigateTo({
      url: '/pages/rich-text/rich-text?type=2',
    })
  },
  submit() {
    wx.navigateTo({
      url: '/pages/apply/apply',
    })
  },
  // 游客登录
  visitor() {
    app.http.$ajax({
      url: 'user/visitor',
      data: {
        org_cate_id: app.globalData.auth.org_cate_id,
        open_id: app.globalData.auth.open_id
      }
    }, {
        success(res) {
          //保存用户信息 
          app.globalData.auth = res.data.userinfo

          console.log(app.globalData.auth)
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }, 1000);
        }
      });
  },
  bindGetUserInfo: function (e) {
    let that = this;
    console.log(e)
    if (e.detail.errMsg != 'getUserInfo:ok') {
      wx.showModal({
        title: '温馨提示',
        content: '你拒绝了授权登录,为了更好的为你提供服务,请重新进行登录',
      })
    } else {
      app.login(function (res) {
        that.choose(e.currentTarget.dataset)
      });
    }
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
})