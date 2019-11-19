const app = getApp();
Page({

    data: {
        tabIdx: 1,
        tab: [
            {
                type: 1,
                name: '幼儿课程'
            },
            {
                type: 2,
                name: '小学课程'
            },
            {
                type: 3,
                name: '初中课程'
            },
            {
                type: 4,
                name: '高中课程'
            },
        ],
        type: 0,
        banners: [
          {
            imageurl: '../../images/banner1.jpg'
          }
        ],
        list: [],
        loading: false,
        tip: '上拉加载',
        is_pull: true,
        page: 1
    },
    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    height: (((res.windowHeight - 215) * 750) / res.windowWidth)
                })
            }
        })
        let type = options.type;
        this.data.type = type;
        wx.setNavigationBarTitle({
          title: options.title ? options.title: '课程'
        });  
        this.getBanner()
        this.getList();
    },
    getBanner() {
        app.http.$ajax({
            url: 'v1.learn/getBanner',
            data: {
                learn_cate_id: this.data.type
            },
            loading: false
        }, {
            success: (res) => {
                this.setData({
                    // banners: app.processImg(res.data.data, 'imageurl')
                })
            }
        })
    },
    getList() {
        let that = this;
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
            url: 'v1.learn/learnCateCourse1',
            data: {
                learn_cate_id: this.data.type, //课程类别
                type: this.data.tabIdx,
                page: this.data.page
            },
            loading: false
        }, {
            success: (res) => {
                that.data.page++
                let data = app.processImg(res.data.data);
                this.data.list.push(...data)
                this.setData({
                    list: this.data.list
                });
            },
            complete(res) {
                let tip = '';
                if (app.util.isString(res)) {
                    app.info(res);
                    tip = '上拉加载';
                    that.data.is_pull = true;
                } else if (!app.util.isUndefined(res.data) && app.util.isArray(res.data.data)) {
                    if (res.data.data.length < 15) {
                        that.data.is_pull = false;
                        tip = '没有更多课程'
                    } else {
                        tip = '上拉加载';
                        that.data.is_pull = true;
                    }
                }
                that.setData({
                    loading: false,
                    tip: tip,
                })
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
        //触发重新加载
        this.getList();
    },

    open(event) {
        let course_id = event.currentTarget.dataset.course_id;
        wx.navigateTo({
            url: '/pages/lesson-detail/lesson-detail?course_id=' + course_id,
        })
    }
})