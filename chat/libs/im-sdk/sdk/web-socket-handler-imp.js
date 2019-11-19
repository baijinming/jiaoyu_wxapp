import IIMHandler from "../interface/i-im-handler";

export default class WebSocketHandlerImp extends IIMHandler {
  constructor() {
    super();
    this._onSocketOpen();
    this._onSocketMessage();
    this._onSocketError();
    this._onSocketClose();
  }

  /**
   * 创建WebSocket连接
   * 如：this.imWebSocket = new IMWebSocket();
   *    this.imWebSocket.createSocket({url: 'ws://10.4.97.87:8001'});
   * 如果你使用本地服务器来测试，那么这里的url需要用ws，而不是wss，因为用wss无法成功连接到本地服务器
   * @param options 建立连接时需要的配置信息，这里是传入的url，即你的服务端地址，端口号不是必需的。
   */
  createConnection({
    options
  }) {
    !this._isLogin && wx.connectSocket({
      url: options.url,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST'
    });
  }

  _sendMsgImp({
    content,
    success,
    fail
  }) {
    console.log('发送格式如下：')
    console.log(content)
    wx.sendSocketMessage({
      data: JSON.stringify(content),
      success: (res) => {
        success && success(content);
      },
      fail: (res) => {
        fail && fail(res);
      }
    });
  }


  /**
   * 关闭webSocket
   */
  closeConnection() {
    wx.closeSocket();
  }

  _onSocketError(cb) {
    wx.onSocketError((res) => {
      this._isLogin = false;
      console.log('WebSocket连接打开失败，请检查！', res);
    })
  }

  _onSocketClose(cb) {
    wx.onSocketClose((res) => {
      this._isLogin = false;
      console.log('WebSocket 已关闭！', res)
    });
  }

  _onSocketOpen() {
    wx.onSocketOpen((res) => {
      console.log('WebSocket连接已打开！');
      if (!this.loginListener) {
        console.log('登陆回调未设置，请先设置');
        return;
      }
      this.loginListener(({
        content,
        success,
        fail
      }) => {
        this._sendMsgImp({
          content,
          fail: (res) => {
            console.log('认证失败')
            fail && fail(res);
          },
          success: (res) => {

            success && success(res)
          }
        });
      });
    });
  }

  /**
   * webSocket是在这里接收消息的
   * 在socket连接成功时，服务器会主动给客户端推送一条消息类型为login的信息，携带了用户的基本信息，如id，头像和昵称。
   * 在login信息接收前发送的所有消息，都会被推到msgQueue队列中，在登录成功后会自动重新发送。
   * 这里我进行了事件的分发，接收到非login类型的消息，会回调监听函数。
   * @private
   */
  _onSocketMessage() {
    wx.onSocketMessage((res) => {
      let msg = JSON.parse(res.data);
      console.log(msg)
      if (1 === msg.cmd) {
        this._isLogin = true;
        this._receiveListener(msg);
        if (this._msgQueue.length) {
          let temp;
          while (temp = this._msgQueue.shift()) {
            this.sendMsg({
              content: { ...temp
              }
            });
          }
        }
      } else {
        this._receiveListener && this._receiveListener(msg);
      }
    })
  }

  //登陆认证
  setOnLoginListener(fun) {
    this.loginListener = fun;
  }
}