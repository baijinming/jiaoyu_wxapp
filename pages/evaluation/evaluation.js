const app = getApp();
Page({

    data: {
        banner: [
          { imageurl: app.globalData.oss_url + '/uploads/orgid0/adszone/20191115/763d51c7ed2b48f5b6c922b081f1f13c.png'}
        ],
        list: []
    },
    onLoad: function (options) {
        // this.getbanner();
        this.getList();
    },
    getbanner() {
        app.http.$ajax({
            url: 'v1.evaluation/getBanner',
            loading: false
        }, {
            success: (res) => {
                this.setData({
                    banner: app.processImg(res.data.data, 'imageurl')
                })
            }
        })
    },
    getList() {
        app.http.$ajax({
            url: 'v1.evaluation/index',
            loading: false
        }, {
            success: (res) => {
                this.setData({
                    list: app.processImg(res.data.data)
                });
            }
        });
    },
    open(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/evaluation-detail/evaluation-detail?id=' + id,
        })
    },

    onPullDownRefresh() {
      // this.getbanner();
      this.getList();
    }

})