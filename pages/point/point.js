// pages/point/point.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        my: {},
        name: '',
        page: 1,
        list: [],
        loading: false,
        tip: '上拉加载',
        is_pull: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getList();
    },
    getList(down=false) {
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
            'url': 'v1.personal/myscore',
             data: {
                page: this.data.page
             },
             loading: false
        }, {
            success: (res) => {
                this.data.page++;
                this.setData({
                    my: res.data.info[0]
                })
                if(down == false) {
                    this.data.list.push(...res.data.data)
                } else {
                    this.data.list = res.data.data;
                }
                this.setData({
                    list: this.data.list
                })
            },
            complete: (res) => {
                app.http.complete(this, res, app)
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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
        this.getList(true);
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