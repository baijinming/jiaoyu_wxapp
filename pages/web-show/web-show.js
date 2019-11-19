// pages/teacher/teacher.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let src = options.src;
        let type = options.type;
        src = src  + '?type=' + type;
        if(options.src) {
            this.setData({
                src: src
            })
        } else {
            app.error('请传递链接');
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

  
  

  

   
})