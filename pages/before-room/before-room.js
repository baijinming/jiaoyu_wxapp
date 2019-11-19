// pages/advance/advance.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        room_id: 0,
        info: {},
        clearTimer: false,
        targetTime: 1000
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let info = JSON.parse(options.info);
        let time = info.start_time * 1000;
        this.setData({
            targetTime: time,
            info: info
        });
    },
    open(e) {
        app.http.$ajax({
            url: 'v1.chat_manager/open',
            data: {
                room_id: this.data.info.room_id
            },
            loading: '开放中...'
        }, {
            success: (res) => {
                let info = JSON.stringify(this.data.info);

                wx.redirectTo({
                  url: '/pages/chat/chat?info=' + info,
                })
            }
        })
    },

    onUnload() {
        this.setData({
            clearTimer: true
        });
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