const app = getApp();
Page({

  data: {
    tabIdx: 0,
    banners: [
      { imageurl: app.globalData.oss_url + '/uploads/orgid0/adszone/20191115/763d51c7ed2b48f5b6c922b081f1f13c.png' }
    ],
    list: [],
    before: []
  },
  onLoad: function(options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: (((res.windowHeight - 238) * 750) / res.windowWidth)
        })
      }
    })

    // this.getBanner()
    this.getList();
  },
  toMore() {
    wx.navigateTo({
      url: '/pages/chat-history/history',
    })
  },
  getBanner() {
    app.http.$ajax({
      url: 'v1.chat/banners',
      loading: false
    }, {
      success: (res) => {
        this.setData({
          banners: app.processImg(res.data.data, 'imageurl')
        })
      }
    });
  },
  getList() {
    app.http.$ajax({
      url: 'v1.chat/history',
      loading: '获取直播数据...'
    }, {
      success: (res) => {
        this.setData({
          list: app.processImg(res.data.data)
        })
      }
    })
  },
  handleTab(e) {
    let idx = e.currentTarget.dataset.idx;
    if (idx == 1) { //直播预告
      this.getBefore()
    }
    this.setData({
      tabIdx: e.currentTarget.dataset.idx
    })
  },
  getBefore() {
    app.http.$ajax({
      url: 'v1.chat/getBefore'
    }, {
      success: (res) => {
        this.setData({
          before: res.data
        })
      }
    })
  },
  open(e) {
    let course_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/lesson-detail/lesson-detail?course_id=' + course_id + '&live=true',
    })

  },
  chat(e) {
    let start_time = e.currentTarget.dataset.start_time;
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/advance/advance?id=' + id + '&start_time=' + start_time,
    })
  },
  // 结束直播
  end(e) {
    return false;
    let that = this;
    let id = e.currentTarget.dataset.id;
    let course_id = e.currentTarget.dataset.course_id;
    that.onid = id;
    let msgsum, array = [];
    wx.onSocketMessage((res) => {
      console.log('WebSocket收到消息')
      let data = JSON.parse(res.data);
      console.log(data)
      if (data.cmd == 1) {
        msgsum = data.data.msgsum
        // 登录后拉取数据
        wx.sendSocketMessage({
          data: JSON.stringify({
            "cmd": 2,
            "data": {
              "roomid": that.onid,
              "start": 1,
              "stop": msgsum
            }
          })
        })
      } else if (data.cmd == 3) {
        array.push(data.data)
        if (array.length == msgsum) {
          // 数据拉取完成
          let info = JSON.stringify(array);
          let form = {
            course_id: course_id,
            room_id: id,
            info: info
          }
          app.http.$ajax({
            url: 'v1.chat/getwebsocket',
            data: form
          }, {
            success: (res) => {
              app.http.$ajax({
                url: 'v1.chat/chatroomdo',
                data: {
                  room_id: id,
                  type: 2
                }
              }, {
                success: (res) => {
                  if (res.code == 1) {
                    that.getBefore()
                  }
                }
              })
            }
          })
        }
      }
    })
    wx.onSocketOpen(() => {
      console.log('WebSocket连接打开')
    })
    wx.onSocketError(function(res) {
      console.log('WebSocket连接打开失败')
    })

    wx.onSocketClose(function(res) {
      console.log('WebSocket 已关闭！')
    })
    this.socket = wx.connectSocket({
      url: 'wss://39.106.192.35/ws?token=' + app.globalData.auth.token,
      success() {
        setTimeout(() => {
          // 连接后登录
          wx.sendSocketMessage({
            data: JSON.stringify({
              "cmd": 1,
              "data": {
                "roomid": id,
                "openid": app.globalData.auth.openid
              }
            })
          })
        }, 0)
      }
    })

  },

  onPullDownRefresh() {
    let idx = this.data.tabIdx;
    this.getBanner()
    if (idx == 1) { //直播预告
      this.getBefore()
    } else {
      this.getList();
    }
  }

})