const app = getApp();
Page({

    data: {
        name: '',
        page: 1,
        list: [],
        loading: false,
        tip: '上拉加载',
        is_pull: true
    },
    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    height: ((res.windowHeight * 750) / res.windowWidth) - 100
                })
            }
        })
        this.getList();
    },
    bindKeyInput(e) {
        this.setData({
            name: e.detail.value
        })
    },
    submit() {
        if (app.util.isEmpty(this.data.name)) {
            return app.info('问题不能为空');
        }
        app.http.$ajax({
            url: 'v1.qa/add',
            data: {
                name: this.data.name
            },
            loading: '提交问题中...'
        })
    },
    getList(down = false) {
        let that = this;
        if (this.data.is_pull != true) {
            return;
        }
        this.data.is_pull = false;
        this.setData({
            loading: true,
            tip: '正在加载',
        })
        app.http.$ajax({
            url: 'v1.qa/getList',
            data: {
                page: this.data.page,
                my: 1
            },
            loading: false
        }, {
                success(res) {
                    if (down === true) {
                        that.data.list = res.data.data;
                    } else {
                        that.data.list.push(...res.data.data);
                    }
                    that.setData({
                        list: that.data.list
                    })
                    that.data.page++;
                },
                complete(res) {
                    app.http.complete(that, res, app)
                }
            })
    },

    onPullDownRefresh: function () {
        //下拉刷新 重置数据
        this.data.page = 1;
        this.data.is_pull = true;
        this.getList(true);
    },
    open(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/question-detail/question-detail?id=' + id,
        })
    },

})