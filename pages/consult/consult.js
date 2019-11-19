const app = getApp();
Page({
    data: {
        loading: false,
        tip: '上拉加载',
        is_pull: true,
        page: 1,
        list: []
    },
    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    height: ((res.windowHeight * 750) / res.windowWidth)
                })
            }
        });
        this.getList();
    },
    getList(down = false) {
        let that = this;
        // if (this.data.is_pull != true) {
        //     return;
        // }
        this.setData({
            loading: true,
            tip: '正在加载',
        })
        app.http.$ajax({
            url: 'v1.consult/index',
            loading: false,
            data: {
                page: this.data.page
            }
        }, {
            success: (res) => {
                this.data.page++;
                let temp = app.processImg(res.data.data);
                if(down == false) {
                    this.data.list.push(...temp);
                } else {
                    this.data.list = temp;
                }
                this.setData({
                    list: this.data.list
                })
            },
            complete: (res) => {
                app.http.complete(this, res, app);
            }
        });
    },
    open(event) {
        let id = event.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/consult-detail/consult-detail?id=' + id,
        })
    },

    // onPullDownRefresh: function () {
    //     //下拉刷新 重置数据
    //     // this.data.page = 1;
    //     // this.data.is_pull = true;
    //     this.getList(true);
    // }

    onPullDownRefresh() {
      this.data.page = 1;
      this.getList(true);
    },
    onReachBottom() {
      this.getList();
    }

})