Component({
  properties: {
    chat: {
      //标题
      type: Object,
      value: {

      }, 
    },
    ifshowtext: {
      type: Boolean,
      value: false
    }
  },
  data: {
    sendText: [
      '精彩', '感谢张老师分享', '666','老师讲的不错知识点很全面'
    ],
    textMessage: ''
  },
  methods: {
    listenersSend(e) {
      let message = e.currentTarget.dataset.value;
      this.setData({
        textMessage: message
      })
    },
    showtext(e) {
      this.triggerEvent('ifshowtextclick', {
        ifshowtext: !this.data.ifshowtext
      })
    },
    chatInputSendTextMessage(e) {
      let content = this.data.textMessage;
      if(!content) {
        return;
      }
      let type = 1;
      this.triggerEvent('listenersend', {
        content,
        type
      })
      this.setData({
        textMessage: ''
      })
    }
  }
});
