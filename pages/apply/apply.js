const app = getApp();
Page({
    /**
    * 页面的初始数据
    */
    data: {
        second: 60,
        is_show: false,
        name: '' ,  //
        real_name: '',
        mobile: '',
        captcha: '',
      image_url: app.http.image_url
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       
    },
    changenName(e) {
        this.setData({
            name: e.detail.value
        })
    },
    changeRealName(e) {
        this.setData({
            real_name: e.detail.value
        })
    },
    changeMobile(e) {
        this.setData({
            mobile: e.detail.value
        })
    },
    changeCaptcha(e) {
        this.setData({
            captcha: e.detail.value
        })
    },

    onUnload() {
       
    },
    send() {
        if (!app.util.isPhone(this.data.mobile)) {
            return app.info('请正确输入手机号')
        }
        app.http.$ajax({
            url: 'sms/send',
            data: {
                mobile: this.data.mobile,
                event: 'reply'  //申请入住
            }
        }, {
            success: (res) => {
                app.info('发送成功');
                this.countdown(this);
            }
        })
    },
    submit() {
        app.http.$ajax({
            url:'v1.org/reply',
            data: {
                name: this.data.name,  //
                real_name: this.data.real_name,
                mobile: this.data.mobile,
                captcha: this.data.captcha
            }
        }, {
            success: (res) => {
                app.success('提交申请成功...', function() {
                    setTimeout(function() {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 1000)
                })
            }
        })
    },
    countdown: function(that) {
        var second = that.data.second 
        if(second == 0) {
            that.setData({
                is_show: false,
                second: 60
            });
            return;
        } 
        
        var time = setTimeout(function () {
            that.setData({
                is_show: true,
                second: second - 1
            });
            that.countdown(that);
        }, 1000)
    },
    open() {
      wx.navigateTo({
        url: '/pages/rich-text/rich-text?type=3',
      })
    },

})