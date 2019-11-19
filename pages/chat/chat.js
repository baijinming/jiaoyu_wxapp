// pages/list/list.js../../modules/chat-input/chat-input
import * as chatInput from "../../chat/modules/chat-input/chat-input";
import IMOperator from "./im-operator";
import UI from "./ui";
import MsgManager from "./msg-manager";
const app = getApp();
let historyArr = []; //临时储存数组
/**
 * 聊天页面
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textMessage: '',
    chatItems: [],
    latestPlayVoicePath: '',
    isAndroid: true,
    chatStatue: 'open',
    popshow: false,
    auth: 3, //3为听众, 1为主持人 2为主讲人
    info: {},
    listeners: [],
    msgsum: 0,
    cmtsum: 0,
    ifshowtext: false, //是否展示观众弹幕,
    titleinfo: {
      start_time: 0,
      name: '聊天室'
    },
    getHistoryNum: 10, //一次拉取历史消息数量
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let info = JSON.parse(options.info);
    console.log(info)

    this.setData({
      info: info,
      auth: info.user_auth,
    })
    this.setData({
      titleinfo: {
        name: info.name,
        start_time: info.start_time,
        bannerList: info.is_show_ppt == 1 ? info.file.split(',') : [],
        talk_info: info.talk_info
      }
    })

    let room = {
      roomid: info.room_id,
      openid: app.globalData.auth.openid,
      auth: info.user_auth ? info.user_auth : 3
    }

    this.initData();
    wx.setNavigationBarTitle({
      title: '直播间'
    });
    this.imOperator = new IMOperator(this, room);
    this.UI = new UI(this);
    //进行登陆认证
    this.imOperator.onLoginCb({
      success: (res) => {

        //this.imOperator.getHistory(450, 60000)
      },
      fail: (res) => {

      }
    });
    this.msgManager = new MsgManager(this);

    this.imOperator.onSimulateReceiveMsg((msg, cmd) => {
      let that = this;
      // 拉取历史消息
      if (cmd == 3 && this.data.getHistoryNow) {
        historyArr.push(msg);
        let number = that.data.getHistoryNum;
        if (that.data.msgsum < 1) {
          number = number + that.data.msgsum
        }
        if(historyArr.length >= number) {
          console.log(historyArr)
          that.setData({
            chatItems: [...historyArr, ...that.data.chatItems],
            getHistoryNow: false,
            scrollTopVal: 200 * that.data.getHistoryNum
          })
          historyArr = []
        }
        return;
      }
      // 处理撤回消息
      if(cmd == 4) {
        let arr = that.data.chatItems;
        let newArr = [];
        for(let i = 0; i < arr.length; i++) {
          if(arr[i].msgid != msg.msgid) {
            newArr.push(arr[i])
          }
        }
        that.setData({
          chatItems: newArr
        })
        return;
      }

      msg.isMy = msg.openid === getApp().globalData.auth.openid;

      //主持人
      if (cmd == 3) {
        let arr = that.data.chatItems;
        if (arr.length >= 1 && arr[arr.length - 1].msgid == undefined) {
          arr.pop();
          arr.push(msg);
          that.setData({
            chatItems: arr
          })
        }
        if (this.isexist(msg.saveKey) === true) {

          return;
        }
        console.log(msg);
        this.msgManager.showMsg({
          msg: msg
        })
      } else if (cmd == 6) {
        if (this.data.listeners.length >= 3) {
          this.data.listeners.shift();
          this.data.listeners.push(msg)
        } else {
          this.data.listeners.push(msg)
        }
        this.setData({
          listeners: this.data.listeners
        })
      }
      // 处理所有已撤回的消息   recall=0 正常  recall=1 表示消息已撤回
      let arr = that.data.chatItems;
      let newArr = [];
      for(let i = 0; i < arr.length; i++) {
        if(arr[i].recall == 0) {
          newArr.push(arr[i])
        }
      }
      that.setData({
        chatItems: newArr
      })

      // app.http.$ajax({
      //   url: 'v1.chat/getAuth',
      //   data: {
      //     id: this.data.info.id, //直播室id
      //     open_id:msg.openid,     //openid
      //   },
      //   loading: false
      // }, {
      //   success: (res) => {
      //       //主持人
      //       msg.headUrl = res.data.avatar
      //       let newmsg = Object.assign(msg, res.data)

      //       if(cmd == 3) {
      //         if (newmsg.isMy) {
      //           return;
      //         }

      //         this.msgManager.showMsg({msg:newmsg})
      //       } else if(cmd == 6) {
      //         if (this.data.listeners.length >= 3) {
      //           this.data.listeners.shift();
      //           this.data.listeners.push(newmsg)
      //         } else {
      //           this.data.listeners.push(newmsg)
      //         }
      //         this.setData({
      //           listeners: this.data.listeners
      //         })
      //       }
      //   },
      //   fail:(res) => {

      //   }
      // })
    });
  },

  initData() {
    let that = this;
    let systemInfo = wx.getSystemInfoSync();
    chatInput.init(this, {
      systemInfo: systemInfo,
      minVoiceTime: 1,
      maxVoiceTime: 60,
      startTimeDown: 56,
      format: 'mp3', //aac/mp3
      sendButtonBgColor: 'mediumseagreen',
      sendButtonTextColor: 'white',
      extraArr: [{
          picName: 'choose_picture',
          description: '照片'
        },
        {
          picName: 'take_photos',
          description: '拍摄'
        },
        {
          picName: 'close_chat',
          description: '预定义'
        },
        {
          picName: 'file',
          description: '文件'
        }
      ],
      // tabbarHeigth: 48
    });

    let rpxheight = ((systemInfo.windowHeight * 750) / systemInfo.windowWidth)
    let scrollHeight = rpxheight - 130
    that.setData({
      scrollHeight: scrollHeight,
      pageHeight: systemInfo.windowHeight,
      isAndroid: systemInfo.system.indexOf("Android") !== -1,
    });
    wx.setNavigationBarTitle({
      title: '聊天室'
    });
    that.textButton();
    that.extraButton();
    that.voiceButton();
  },

  textButton() {
    chatInput.setTextMessageListener((e) => {
      let content = e;
      if(typeof(e) != 'string') {
        content = e.detail.value
      }
      this.msgManager.sendMsg({
        type: IMOperator.TextType,
        content
      });
    }, );
  },
  popSend(e) {
    let content = e.detail.content;
    let type = e.detail.type;
    let is_line = false;
    if (type == 4 || type == 5) {
      is_line = true;
    }
    this.setData({
      popshow: false
    })

    this.msgManager.sendPopMsg({
      type: type,
      content,
      is_line
    });
  },
  listenersend(e) {
    this.setData({
      ifshowtext: false
    })
    let content = e.detail.content;
    let type = e.detail.type;
    this.setData({
      popshow: false
    })

    this.imOperator.listenerSendMsg({
      type: type,
      content
    });
  },
  //解决事件
  chatInputGetValueEvent: function(e) {
    chatInput.chatInputGetValueEvent(e);
  },

  voiceButton() {
    chatInput.recordVoiceListener((res, duration) => {
      let tempFilePath = res.tempFilePath;
      this.msgManager.sendMsg({
        type: IMOperator.VoiceType,
        content: tempFilePath,
        duration
      });
    });
    chatInput.setVoiceRecordStatusListener((status) => {
      this.msgManager.stopAllVoice();
    });
  },

  //模拟上传文件，注意这里的cbOk回调函数传入的参数应该是上传文件成功时返回的文件url，这里因为模拟，我直接用的savedFilePath
  simulateUploadFile({
    savedFilePath,
    duration,
    itemIndex,
    success,
    fail
  }) {
    console.log('录音222文件');
    console.log(savedFilePath);
    //进行文件上传
    wx.uploadFile({
      url: app.http.apiurl + 'common/upload',
      filePath: savedFilePath,
      name: 'file',
      success(e) {
        let res = JSON.parse(e.data);
        if (res.code == 1) {
          let urlFromServerWhenUploadSuccess = app.http.host + res.data.url;
          console.log(urlFromServerWhenUploadSuccess);
          //这里进行上传文件处理
          success && success(urlFromServerWhenUploadSuccess);
        }
      },
      complete() {

      }
    })
  },
  extraButton() {
    let that = this;
    chatInput.clickExtraListener((e) => {
      let chooseIndex = parseInt(e.currentTarget.dataset.index);
      console.log(chooseIndex);
      if (chooseIndex === 2) {
        that.myFun();
        return;
      }
      //上传文件
      if (chooseIndex == 3) {
        wx.chooseMessageFile({
          count: 1,
          type: 'file',
          success(res) {
            //进行文件上传
            console.log(res)
            let size = res.tempFiles[0].size;
            let sizeStr;
            if (size > 1048576) {
              let arr = ((size / 1048576) + '').split('.');
              sizeStr = arr[0] + '.' + arr[1].substring(0, 1) + 'MB'
            } else {
              let arr = ((size / 1024) + '').split('.');
              sizeStr = arr[0] + '.' + arr[1].substring(0, 1) + 'KB'
            }
            that.msgManager.sendMsg({
              type: IMOperator.FileType,
              content: res.tempFiles[0].path,
              fileName: res.tempFiles[0].name,
              fileSize: sizeStr,
            })
            
          }
        })
        return;
      }
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'],
        sourceType: chooseIndex === 0 ? ['album'] : ['camera'],
        success: (res) => {
          that.msgManager.sendMsg({
            type: IMOperator.ImageType,
            content: res.tempFilePaths[0]
          })
        }
      });
    });
  },
  /**
   * 自定义事件
   */
  myFun() {
    this.setData({
      popshow: true
    })
  },
  closepop() {
    this.setData({
      popshow: false
    });
  },
  //聊天代码
  onHide() {
    app.appIMDelegate.onHide();
  },
  //聊天代码
  onShow(options) {
    //连接聊天服务器
    let url = 'wss://messageserver.yijiafmxt.com/ws?token=' + app.globalData.auth.token
    console.log()
    app.appIMDelegate.onShow({
      url: url
    });
  },

  resetInputStatus() {
    chatInput.closeExtraView();
    this.setData({
      'inputObj.category': 0
    })
  },
  ifshowtextclick(e) {
    this.setData({
      ifshowtext: e.detail.ifshowtext
    })
  },
  sendMsg({
    content,
    itemIndex,
    success
  }) {
    console.log('sendMsg')
    console.log(content)
    this.imOperator.onSimulateSendMsg({
      content,
      success: (msg) => {
        this.UI.updateViewWhenSendSuccess(msg, itemIndex);
        success && success(msg);
      },
      fail: () => {
        this.UI.updateViewWhenSendFailed(itemIndex);
      }
    })
  },
  /**
   * 重发消息
   * @param e
   */
  resendMsgEvent(e) {
    const itemIndex = parseInt(e.currentTarget.dataset.resendIndex);
    const item = this.data.chatItems[itemIndex];
    this.UI.updateDataWhenStartSending(item, false, false);
    this.msgManager.resend({ ...item,
      itemIndex
    });
  },

  //判断是否存在数据中了
  isexist(key) {
    let chatItems = this.data.chatItems;
    for (let i = 0; i < chatItems.length; i++) {
      let obj = chatItems[i];

      if (obj.saveKey == key && obj.saveKey != undefined) {
        return true;
      }
    }
    return false;
  },

  // 撤回消息
  recallChatItems(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let msgid = that.data.chatItems[index].msgid;
    wx.showModal({
      title: '确定撤回消息吗？',
      content: '',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let data = {
            cmd: 4,
            data: {
              roomid: that.data.info.room_id,
              openid: app.globalData.auth.openid,
              msgid: msgid
            }
          }
          console.log(JSON.stringify(data))
          wx.sendSocketMessage({
            data: JSON.stringify(data),
            success() {

            },
            fail(err) {
              console.log(err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  //  拉取更多历史消息
  getMoreHistory() {
    this.imOperator.getHistory(this.data.msgsum, this.data.getHistoryNum)
  },
  onUnload() {
    wx.closeSocket()
  }

});