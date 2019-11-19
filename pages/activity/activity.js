const app = getApp();
Page({

    data: {
        tabIdx: 0,
        cate: [],
        list: [],
        loading: false,
        tip: '上拉加载',
        is_pull: true,
        page: 1,
        activity_cate_id: 0
    },

    handleTab(e) {
        if (this.data.tabIdx == e.currentTarget.dataset.idx) {
            return; //点击同一个tab不重新刷新
        }
        this.data.activity_cate_id = e.currentTarget.dataset.id
        this.setData({
            tabIdx: e.currentTarget.dataset.idx
        })
        //每次切换tab 重新请求 重置 list当中的数据
        this.setData({
            list: []
        })
        this.data.page = 1; //分页置为1
        this.data.is_pull = true; //可以刷新
        this.getList(this.data.activity_cate_id); //获取分类数据
    },
    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    height: ((res.windowHeight * 750) / res.windowWidth) - 74
                })
            }
        });
        let that = this;
        this.getCate(function(res) {
           if(that.data.cate.length > 0) {
               let item = that.data.cate[0];
               let id = item.id;
               that.data.activity_cate_id = id;
               that.getList(id);
           }
        });
    },
    //获取分类
    getCate(fn) {
        let that = this;
        app.http.$ajax({
            url: 'v1.activity/getCate',
            loading: false
        }, {
            success(res) {
                that.setData({
                    cate: res.data
                });
                if (app.util.isFunction(fn)) {
                    fn(res);
                }
            }
        })
    },
    scroll() {
        this.getList(this.data.activity_cate_id);
    },
    //活动列表
    getList(activity_cate_id, down = false) {
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
            url: 'v1.activity/getList',
            data: {
                page: this.data.page,
                activity_cate_id: activity_cate_id
            },
            loading: false
        }, {
            success(res) {
                that.data.page++;
                let temp = app.processImg(res.data.data);
                if(down == false) {
                    that.data.list.push(...temp);
                } else {
                    that.data.list = temp;
                }
                that.setData({
                    list: that.data.list
                })
            },
            complete(res) {
                app.http.complete(that, res, app)
            }
        })
    },
    open(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/activity-detail/activity-detail?id=' + id,
        })
    }
})