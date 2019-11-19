// pages/question-detail/question-detail.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        q_info: {},
        page: 1,
        list: [],
        loading: false,
        tip: '上拉加载',
        is_pull: true,
        anster: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    height: ((res.windowHeight * 750) / res.windowWidth) - 100
                })
            }
        })
        this.setData({
            id: options.id
        });
        this.getAnsters();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    getAnsters(down = false) {
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
            url: 'v1.qa/getAnswer',
            data: {
                id: this.data.id,
                page: this.data.page
            },
            loading: false
        }, {
            success(res) {
                if(that.data.page === 1) {
                    that.setData({
                        q_info: app.processImg(res.data.q_info)
                    })
                }
                let list = app.processImg(res.data.list.data)
                if (down === false) {
                    that.data.list = res.data.list.data;
                } else {
                    that.data.list.push(...list);
                }
                that.data.page++;
                that.setData({
                    list: list
                });
            },
            complete(res) {
                let tip = '';
                if (app.util.isString(res)) {
                    app.info(res);
                    tip = '上拉加载';
                    that.data.is_pull = true;
                } else if (!app.util.isUndefined(res.data.list) && app.util.isArray(res.data.list.data)) {
                    if (res.data.list.data.length < 15) {
                        that.data.is_pull = false;
                        tip = '没有更多数据'
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
    bindKeyInput(e) {
        this.setData({
            anster: e.detail.value
        })
    },
    //回答问题
    addAnswer() {
        if (app.util.isEmpty(this.data.anster)) {
            return app.info('回答不能为空');
        }
        app.http.$ajax({
            url: 'v1.qa/addAnswer',
            data: {
                anster: this.data.anster,
                parent_questions_id: this.data.id
            },
            loading: '提交回答...'
        }, {
          success: (res) => {
            wx.startPullDownRefresh()
          }
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        //下拉刷新 重置数据
        this.data.page = 1;
        this.data.is_pull = true;
        this.getAnsters(true);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})