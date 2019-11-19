const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
Page({

  data: {
    id: 0
  },
  onLoad: function (options) {
    this.data.id = options.id;
    this.getInfo();
  },
  getInfo() {
    app.http.$ajax({
      url: 'v1.activity/getDetail',
      data: {
        id: this.data.id
      }
    }, {
        success: (res) => {
          WxParse.wxParse('introduce', 'html', res.data.content, this, 5);
        }
      })
  },
})