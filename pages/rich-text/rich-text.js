const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
Page({

  data: {
    id: 0
  },
  onLoad: function (options) {
    this.data.type = options.type; // 0 关于我们  1 联系我们  2  用户须知  3  入驻协议  4  密码找回须知
    this.getInfo();
    let title = '';
    switch(this.data.type) {
      case '0' :
        title = '关于我们';
        break;
      case '1' :
        title = "联系我们";
        break;
      case '2' :
        title = "用户须知";
        break;
      case '3' :
        title = "入驻协议";
        break;
      case '4':
        title = "密码找回须知";
        break;
      default:
        title = "慧亦家";
    }
    wx.setNavigationBarTitle({
      title: title,
    })
  },
  getInfo() {
    app.http.$ajax({
      url: 'v1.org/about',
      data: {
        type: this.data.type
      }
    }, {
        success: (res) => {
          WxParse.wxParse('introduce', 'html', res.data.content, this, 5);
        }
      })
  },
})