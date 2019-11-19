var app = getApp();
Page({
    data: {
        account: '',
        password: '',
        school: '',
        image_url: app.http.image_url
    },
    account(e) {
        this.setData({
            account: e.detail.value
        })
    },
    password(e) {
        this.setData({
            password: e.detail.value
        })
    },
    detail() {
      wx.navigateTo({
        url: '/pages/rich-text/rich-text?type=4',
      })
    },
    open() {
        if (app.util.strlen(this.data.account) <= 2) {
            return app.error('请正确填写账号');

        }
        if (app.util.strlen(this.data.password) <6) {
            return app.error('请正确填写密码');
        }
        app.http.$ajax({
            url: 'user/login',
            data: {
                account: this.data.account,
                password: this.data.password,
                org_cate_id: app.globalData.auth.org_cate_id,
                open_id: app.globalData.auth.open_id
            }
        }, {
            success(res) {
                //保存用户信息 
                app.globalData.auth = res.data.userinfo
                wx.switchTab({
                    url: '/pages/index/index',
                })
            }
        });
    },
    visitor() {
        app.http.$ajax({
            url: 'user/visitor',
            data: {
                org_cate_id: app.globalData.auth.org_cate_id,
                open_id: app.globalData.auth.open_id
            }
        }, {
                success(res) {
                    //保存用户信息 
                    app.globalData.auth = res.data.userinfo
              
                    console.log(app.globalData.auth )
                    setTimeout(function() {
                        wx.switchTab({
                            url: '/pages/index/index',
                        })
                    }, 1000);
                }
            });
    },
    onLoad: function (options) {
       
        this.setData({
          school: options.school
        });
        if (!app.globalData.auth.org_cate_id || !app.globalData.auth.open_id) {
            wx.navigateTo({
                url: '/pages/choose-school/index'
            })
        }
    },
})