const http = require('./utils/http.js');
const util = require('./utils/util.js');
import AppIMDelegate from "/chat/delegate/app-im-delegate";
App({
  onLaunch: function(e) {
    this.check();
  },
  //登陆之后 生成 对象
  onLaunch(options) {
    this.appIMDelegate = new AppIMDelegate(this);
    this.appIMDelegate.onLaunch(options);
  },
  //获取聊天室助手
  getIMHandler() {
    return this.appIMDelegate.getIMHandlerDelegate();
  },

  globalData: {
    apiurl: http.apiurl,
    host: http.host,
    image_url: http.image_url,
    oss_url: http.oss_url,
    auth: {
      // token: null,
      // org_cate_id: null,
      // expiretime: null,
      avatar: "https://wx.qlogo.cn/mmopen/vi_32/zQUnwbg7tLTIKe6Z0z6ubkuRSVEQGS1tiazVzQPS0ibfTxl0wcz0GykSV3oToSw7VF9T70mu1N7fnDLZLFevqArQ/132",
      createtime: 1570242073,
      expires_in: 2591999,
      expiretime: 1572834073,
      id: 14,
      mobile: "",
      nickname: "PY",
      openid: "oYPBM5TMvwzIiqjBmzT38xGVkTcQ",
      org_cate_id: 1,
      score: 0,
      token: "480862db-9f71-4557-a845-f1b0c7a1e0b3",
      user_auth_type: 0,
      user_id: 14,
      user_type: 0,
      username: "admin1",

    }
  },
  http: http,
  util: util,
  //判断是否登录
  check: function(cb) {
    var that = this;
    if (this.getUserToken()) {
      typeof cb == "function" && cb(this.globalData.auth);
    } else {
      //未登录跳转到登陆页面
      wx.reLaunch({
        url: 'pages/choose-school/index'
      })
    }
  },
  getUserToken: function() {
    var userinfo = this.globalData.auth;
    if (userinfo && typeof userinfo == 'object' && userinfo.token) {
      // 还要检查token是否过期
      let date = new Date();
      var now = date.getTime() / 1000;
      if (now >= (userinfo.expiretime - 20)) {
        return false;
      }
      return userinfo.token;
    }

    return false;
  },
  //微信登陆
  login: function(cb) {
    var that = this;
    //调用登录接口
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.getUserInfo({
            success: function(ures) {
              http.$ajax({
                url: 'user/wxappLogin',
                data: {
                  code: res.code,
                  rawData: ures.rawData,
                },
                loading: '授权中...'
              }, {
                success(res) {
                  that.globalData.auth.open_id = res.data.open_id;
                  typeof cb == "function" && cb(res);
                },
                fail(res) {
                  that.globalData.auth = null;
                  that.showLoginModal(cb);
                }
              })
            },
            fail: function(res) {
              that.globalData.auth = null;

              that.showLoginModal(cb);
            }
          });
        } else {
          that.showLoginModal(cb);
        }
      }
    });
  },
  //显示登录或授权提示
  showLoginModal: function(cb) {
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '当前无法获取到你的个人信息，无法正常登陆，请重新授权',
      showCancel: false,
      success: function(res) {

      }
    });
  },
  //构造CDN地址
  cdnurl: function(url) {
    return url.toString().match(/^https?:\/\/(.*)/i) ? url : this.globalData.oss_url + url;
  },
  processImg(list, field = 'image') {
    let that = this;
    if (util.isArray(list)) {
      list.forEach(function(item, i) {
        if (util.isObject(item)) {
          //值为对象
          if (!util.isUndefined(item[field])) {
            item[field] = that.cdnurl(item[field]);
          }
        } else {
          //值为字符串
          if (util.isString(item)) {
            list[i] = that.cdnurl(item)
          }
        }
      })

    } else if (util.isObject(list)) {
      if (!util.isUndefined(list[field])) {
        list[field] = that.cdnurl(list[field]);
      }
    } else {
      //字符串  
      if (util.isString(item)) {
        list = that.cdnurl(list);
      }
    }

    return list;
  },
  //文本提示
  info: function(msg, cb) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000,
      complete: function() {
        typeof cb == "function" && cb();
      }
    });
  },
  //成功提示
  success: function(msg, cb) {
    wx.showToast({
      title: msg,
      icon: 'success',
      image: '/images/ok.png',
      duration: 2000,
      complete: function() {
        typeof cb == "function" && cb();
      }
    });
  },
  //错误提示
  error: function(msg, cb) {
    wx.showToast({
      title: msg,
      image: '/images/error.png',
      duration: 2000,
      complete: function() {
        typeof cb == "function" && cb();
      }
    });
  },
  //警告提示
  warning: function(msg, cb) {
    wx.showToast({
      title: msg,
      image: '/images/warning.png',
      duration: 2000,
      complete: function() {
        typeof cb == "function" && cb();
      }
    });
  },
  onShow: function(e) {

  },

})