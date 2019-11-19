const app = getApp();
Page({

  data: {
    data: {
      name: '',
      sex: 1,
      birthday: '',
      height: '',
      weight: '',
      mobile: '',
    },
    info: {

    },

    minDate: new Date(1900, 10, 1).getTime(),
    maxDate: new Date().getTime(),
    currentDate: new Date().getTime(),
    show: false
  },
  onLoad: function(options) {
    this.setData({
      id: options.id,
      name: options.name
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: ((res.windowHeight * 750) / res.windowWidth) - 110
        })
      }
    });

  },
  changeName(e) {
    this.setData({
      'data.name': e.detail.value
    })
  },
  changeBirthday(e) {
    this.setData({
      'data.birthday': e.detail.value
    })
  },
  changeSex(e) {
    let type = e.currentTarget.dataset.type;
    this.setData({
      'data.sex': type
    })
  },
  changeHeight(e) {
    this.setData({
      'data.height': e.detail.value
    })
  },
  changeWeight(e) {
    this.setData({
      'data.weight': e.detail.value
    })
  },
  changeMobile(e) {
    this.setData({
      'data.mobile': e.detail.value
    })
  },
  choosedate(e) {
    this.setData({
      show: true
    })
  },
  cancel() {
    this.setData({
      show: false
    })
  },
  confirm(e) {
    this.setData({
      show: false
    })
  },
  onInput(event) {
    this.setData({
      'data.birthday': app.util.timeformat(event.detail, 'y-m-d')
    })
    this.setData({
      currentDate: event.detail
    });
  },
  getInfo() {
    app.http.$ajax({
      url: 'v1.'
    })
  },
  pay() {
    let that = this;
    let form = that.data.data;
    if (form.name == '') {
      app.error('请输入姓名');
      return false;
    }
    if (form.birthday == '') {
      app.error('请输入生日');
      return false;
    }
    if (form.height == '') {
      app.error('请输入身高');
      return false;
    }
    if (form.weight == '') {
      app.error('请输入体重');
      return false;
    }
    if (!(/^1[3456789]\d{9}$/.test(form.mobile))) {
      app.error('请输入正确的手机号码');
      return false;
    }
    // 创建测评
    app.http.$ajax({
      url: 'v1.evaluation/createline',
      data: {
        ...that.data.data,
        id: that.data.id
      },
      loading: '正在创建测评...'
    }, {
      success(res) {
        wx.navigateTo({
          url: '/pages/evalution-answer/answer?url=' + encodeURIComponent(res.data),
        })
      },
      'fail': function(res) {
        app.error(res.msg)
      }

    })

  }
})