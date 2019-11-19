const app = getApp();
Page({
    data: {
        history: [],
        hot: [],
        value: ''
    },
    onLoad: function (options) {
        this.getRecord();
    },
    search(event) {
        let value = event.detail;
        wx.redirectTo({
            url: '/pages/search-course/search-course?kwd=' + value,
        })
    },
    jump(e) {
        let value = e.currentTarget.dataset.kwd;
        wx.redirectTo({
            url: '/pages/search-course/search-course?kwd=' + value,
        })
    },
    getRecord() {
        app.http.$ajax({
            url: 'v1.search/hotSearch',
            loading: false
        }, {
            success: (res) => {
                console.log(res);
                this.setData({
                    history: res.data.history,
                    hot: res.data.hot
                })
            }
        })
    }
})