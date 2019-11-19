// pages/lesson-detail/lesson-detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    info: {},
    src: '',
    currentTime: '00:00', //当前时间
    duration: "00:00", //总时间
    percent: 0,
    isPlaying: false,
    left: -15
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      course_id: options.course_id,
      index: options.index
    })

    if (options.file) {
      this.getInfo()
      return
    }

    this.getChapter()

    // this.data.id = options.chapter_id;
    // this.getDetail();
  },
  getInfo() {
    app.http.$ajax({
      url: 'v1.learn/getCourse',
      data: {
        course_id: this.data.course_id
      },
      loading: '正在加载课程...'
    }, {
        success: (res) => {
          // app.processImg(res.data.image);
          res.data.image = app.globalData.oss_url + res.data.image;
          this.setData({
            info: res.data,
            src: app.globalData.oss_url + res.data.file
          })
          this.play()
        }
      });
  },
  getChapter() {
    app.http.$ajax({
      url: 'v1.learn/getChapter',
      data: {
        id: this.data.course_id
      },
      loading: '加载目录...'
    }, {
        success: (res) => {
          this.setData({
            chapter: app.processImg(res.data),
            info: app.processImg(res.data)[this.data.index],
            src: app.globalData.oss_url + app.processImg(res.data)[this.data.index].file
          })
          console.log(this.data.chapter)
          this.play()
        }
      })
  },
  //下一章节
  goNext() {
    this.setData({
      index: this.data.index + 1 
    })
    this.switchOk()
  },
  //上一章节
  goLast() {
    this.setData({
      index: this.data.index - 1
    })
    this.switchOk()
  },
  //切换章节后的方法
  switchOk() {
    this.setData({
      info: this.data.chapter[this.data.index],
      src: app.globalData.oss_url + this.data.chapter[this.data.index].file
    })
  },
  down() {
    let that = this;
    let url = app.globalData.oss_url + this.data.info.file;
    console.log(url)
    wx.downloadFile({
      url: url, 
      success(res) {
        if (res.statusCode === 200) {
          console.log(res)
          that.setData({
            src: res.tempFilePath
          })
          that.play()
        }
      }
    })
  },
  getDetail() {
    app.http.$ajax({
      url: 'v1.chat/getChapterHistory',
      data: {
        id: this.data.id
      }
    }, {

      success: (res) => {
        let info = app.processImg(res.data, 'file');
        info = app.processImg(res.data);
        this.setData({
          info: app.processImg(res.data, 'file')
        })
      }
    })
  },

  // 播放
  play() {
    this.audioCtx.play();
    this.setData({
      isPlaying: true
    })
  },
  // 暂停
  pause() {
    this.audioCtx.pause();
    this.setData({
      isPlaying: false
    })
  },

  // 前进时间
  goSeek(e) {
    let time = e.currentTarget.dataset.time;
    let newTime = this.data.timeStamp;
    newTime = newTime + parseInt(time)
    this.audioCtx.seek(newTime)
  },
  // 后退时间
  backSeek(e) {
    let time = e.currentTarget.dataset.time;
    let newTime = this.data.timeStamp;
    newTime = newTime - parseInt(time)
    this.audioCtx.seek(newTime)
  },
  //
  touchSeek(e) {
    if(!this.data.isPlaying) {
      this.play()
    }
    // 获取当前位置
    var offsetX = e.touches[0].pageX - e.currentTarget.offsetLeft
    // 获取当前位置站总宽度的百分比
    var p = offsetX / 260;
    // seek跳转至指定位置，
    // this.data.durationTime*p,获取位置百分比在总时间中的占比
    this.audioCtx.seek(this.data.durationTime * p)
  },

  // 时间更新
  timeupdate(e) {
    this.setData({
      timeStamp: e.detail.currentTime,
      durationTime: e.detail.duration,
      percent: (e.detail.currentTime / e.detail.duration) * 100,
      left: -15 + 520 * (e.detail.currentTime / e.detail.duration)
    })
    var obj1 = this.formatMs2Obj(e.detail.currentTime)
    var obj2 = this.formatMs2Obj(e.detail.duration)
    var str1 = obj1.m + ":" + obj1.s
    var str2 = obj2.m + ":" + obj2.s
    // 
    if (this.data.currentTime !== str1) {
      // 更新当前时间
      this.setData({
        currentTime: str1,
        progressPercent: e.detail.currentTime * 100 / e.detail.duration
      })
    }
    // 赋值总时间，每次总时间一致不用赋值
    if (this.data.duration !== str2) {
      this.data.durationTime = e.detail.duration//总时间
      this.setData({
        duration: str2
      })
    }
  },
  // 化为时分秒
  formatMs2Obj(total) {
    var h = this.repairZero(Math.floor(total / 3600))
    var m = this.repairZero(Math.floor((total - h * 3600) / 60))
    var s = this.repairZero(Math.floor(total - h * 3600 - m * 60))
    //ES6 结构  h:h
    return {
      h,
      m,
      s
    }
  },
  // 补零
  repairZero(num) {
    return num < 10 ? ("0" + num) : num
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.audioCtx = wx.createAudioContext('myAudio')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})