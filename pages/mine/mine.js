const app = getApp();
Page({

    data: {
        user: {},
        history: []
    },
    onLoad: function (options) {
        this.setData({
            user: app.globalData.auth
        })
        this.getUserInfo();
        this.getHistory();
    },
    //获取用户信息
    getUserInfo() {
        app.http.$ajax({
            url: 'user/getUserInfo',
            loading: false
        }, {
            success:(res) => {
                app.globalData.auth = res.data
                this.setData({
                    user: res.data
                })
            }
        })
    },
    getHistory() {
        app.http.$ajax({
            url: 'v1.personal/mycoursehistory',
            loading: '加载中...'
        }, {
                success: (res) => {
                    this.setData({
                        history: app.processImg(res.data.data)
                    })
                }
            })
    },
    copy() {
        wx.setClipboardData({
            data: '53489350',
            success(res) {
                wx.showToast({
                    title: '复制成功',
                })
            }
        })
    },
  jump() {
    wx.navigateTo({
      url: '/pages/history/history',
    })
  },
    handleSetting() {
        wx.navigateTo({
            url: '/pages/setting/setting',
        })
    }
})