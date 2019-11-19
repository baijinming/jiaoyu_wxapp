const app = getApp();
Component({
  properties: {
    chatinfo: {
      //标题
      type: Object,
      value: {
        name: '',
        start_time: '',
        bannerList: []
      }
    }
  },
  data: {
    cha: 0,
    hours: 0,
    min: 0,
    seconds: 0,
    timein: null,
    day: '',
    urlHead: 'http://caierimgs.oss-cn-beijing.aliyuncs.com/',
    bannerList: []
  },
  attached: function () {
    let that = this;
    setTimeout(() => {
      // 处理banner
      let arr = that.data.chatinfo.bannerList;
      for (let i = 0; i < arr.length; i++) {
        arr[i] = 'http://caierimgs.oss-cn-beijing.aliyuncs.com/' + arr[i]
      }
      that.setData({
        bannerList: arr
      })
      if (this.data.timein != null) {
        clearInterval(timein)
      }
      if (this.data.chatinfo.start_time > 0) {
        let timein = setInterval(function () {
          that.getFormat();
        }, 1000)
        this.setData({ timein: timein });
      }

    }, 500)

  },
  methods: {
    getFormat() {
      let nowtime = Math.floor((new Date()).getTime() / 1000);
      let start = this.data.chatinfo.start_time;
      let day = new Date(start * 1000).getFullYear() + '-' + (new Date(start * 1000).getMonth() + 1) + '-' + new Date(start * 1000).getDate();
      let cha = nowtime - start; //相差多少秒
      //小时
      let hours = Math.floor(cha / 3600);
  
      //计算小时数后剩余秒
      var level1 = cha % 3600;
      let min = Math.floor(level1 / 60);
    
      let seconds = level1 % 60;
  
      this.setData({
        hours: hours,
        min: min,
        seconds: seconds,
        day: day
      })
    },
    // 预览
    preview(e) {
      let item = e.currentTarget.dataset.item;
      wx.previewImage({
        current: item, // 当前显示图片的http链接
        urls: this.data.chatinfo.bannerList // 需要预览的图片http链接列表
      })
    }
  }
});
