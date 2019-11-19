var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showSearch: false,
        list: [],
        value: '',
        image_url: app.http.image_url
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       
    },
    search(event) {
        let that = this;
        let search = event.detail;
        if (app.util.isEmpty(search)) {
            that.setData({
                showSearch: false,
                list: []
            })
            return;
        }
        
        app.http.$ajax({
            url: 'v1.org/search',
            data: {
                search: search
            },
            loading: false
        },{
            success: function(res) {
                let data = res.data;
                if(data.length > 0) {
                    that.setData({
                        showSearch: true,
                        list: data
                    })
                }
            }
        })
    },

    bindGetUserInfo: function (e) {
        let that = this;
        if (e.detail.errMsg != 'getUserInfo:ok') {
            wx.showModal({
                title: '温馨提示',
                content: '你拒绝了授权登录,为了更好的为你提供服务,请重新进行登录',
            })
        } else {
            app.login(function (res) {
                wx.navigateTo({
                  url: '/pages/choose-school/index2'
                });
            });
        }
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
})