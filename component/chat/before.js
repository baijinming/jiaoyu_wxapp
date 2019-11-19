const app = getApp();
Component({
  properties: {
    popshow: {
      //标题
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        // 属性值变化时执行
        if (newVal == true) {
          this.getList();
        }
      }
    },
    tesetdata: String
  },
  data: {
    active: 1,
    tab: ['预录入文字', '预录入图片'],
    textArr: [
     
    ],
    img: [],
    tabIdx: 0,
    text: ''
  },

  ready: function() {
    let that = this;
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight,
          popheight: ((res.windowHeight * 750) / res.windowWidth)-110,
          popwidth: res.windowWidth,
          scrollheight: ((res.windowHeight * 750) / res.windowWidth)-110 - 169,
        })
      }
    })
  },  
  methods: {
    close() {
      this.triggerEvent('closepop')
    },
    onChange(e) {
      
    },
    getList() {
      app.http.$ajax({
        url: 'v1.chat/beforeMsg',
        loading: '获取中...'
      }, {
        success: (res) => {
          let imgArr = res.data.file;
          for(let i = 0; i < imgArr.length; i++) {
            imgArr[i].image = getApp().globalData.image_url + imgArr[i].image
          }
          this.setData({
            textArr: res.data.text,
            img: imgArr
          })
        }
      })
    },
    // 删除接口
    deleteMsg(e) {
      let that = this;
      let id = e.currentTarget.dataset.id;
      app.http.$ajax({
        url: 'v1.chat/delBefore',
        data: {
          id: id
        },
        loading: '删除中...'
      }, {
        success() {
          console.log('删除成功')
          that.getList();
        }
      })
    },
    innerpopsend(e) {
      let content = e.currentTarget.dataset.send;
      let type = e.currentTarget.dataset.type;
      this.triggerEvent('popsend', {
        content,
        type
      })
    },
    changeArea(e) {
      console.log(e.detail.value);
      this.setData({
        text: e.detail.value
      })
    },
    saveData() {
      app.http.$ajax({
        url: 'v1.chat/saveBefore',
        data: {
          type: 0,
          content: this.data.text
        },
        loading: '录入中...'
      }, {
        success: (res) => {
          this.setData({
            text: ''
          });
          this.getList();
        }
      })
    },
    handleTab(e) {
      this.setData({
        tabIdx: e.currentTarget.dataset.idx
      })
    },
    chooseImg(e) {
      let that = this;
      wx.chooseImage({
        count: 1,
        success(e) {
          that._upload(e.tempFiles[0].path)
        }
      })
    },
    // 预览
    priviewImg(e) {
      let url = e.currentTarget.dataset.image;
      wx.previewImage({
        current: url,
        urls: [url],
      })
    },

    _upload(path) {
      let that = this;
      wx.uploadFile({
        url: app.http.apiurl + 'common/upload',
        filePath: path,
        name: 'file',
        success(e) {
          if (e.statusCode == 200) {
            console.log('fawfeawfaf')
            console.log(e)
            
            let data = JSON.parse(e.data);
            if (data.code==1) {
              app.http.$ajax({
                url: 'v1.chat/saveBefore',
                data: {
                  type: 1,
                  content: data.data.url
                },
                loading: '正在上传...'
              }, {
                success: (res) => {
                    that.getList();
                }
              })
            }
          }
        },
        complete() {
          
        }
      })
    },
  }
});
