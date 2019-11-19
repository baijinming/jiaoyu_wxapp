const app = getApp();
Page({

    data: {
        tabIdx: 0,
        list: [],
        loading: false,
        tip: '上拉加载',
        is_pull: true,
        page: 1,
    },
    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    height: (((res.windowHeight * 750) / res.windowWidth) - 90)
                })
            }
        })
        this.getList();
    },
    
    getList() {
        //is_pull代表是否能继续加载
        if (!this.data.is_pull) {
            return;
        }
        //同时只能一个请求  置为不能加载
        this.data.is_pull = false;
        this.setData({
            loading: true,
            tip: '正在加载',
        });
        app.http.$ajax({
            url: 'v1.personal/mycoupon',
            data: {
                status: this.data.tabIdx,
                page: this.data.page
            },
            loading: false
        }, {
            success:(res) => {
                this.data.page++;
                this.data.list.push(...res.data.data);
                this.setData({
                    list: this.data.list
                });
            },
            complete: (res) => {
                app.http.complete(this, res, app)
            }
        })
    },
    handleTab(e) {
        this.data.is_pull = true; //可以上拉加载
        this.data.page = 1;  //切换tab 把分页重置为1
        this.setData({
            tabIdx: e.currentTarget.dataset.idx,
            list: []
        })
        this.getList();
    },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})