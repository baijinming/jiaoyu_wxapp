// pages/teacher/teacher.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        info: {

        },
        list: [],
        first: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.teacher_id
        });
        this.getTeacher();
    },
    getTeacher() {
        let that = this;
        app.http.$ajax({
            url: 'v1.learn/getTeacherInfo',
            loading: '获取老师简介...',
            data: {
                teacher_id: that.data.id
            }
        }, {
                success(res) {
                    let list = app.processImg(res.data.list);
                    let first = list.shift();
                    that.setData({
                        info: app.processImg(res.data.info),
                        list: list,
                        first: first
                    });
                }
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