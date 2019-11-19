import { dealChatTime } from "../../chat/utils/time";

/**
 * 这个类是IM模拟类，作为示例仅供参考。
 */
export default class IMOperator {
    static TextType = 1;
    static VoiceType = 2;
    static FileType = 3;
    static ImageType = 4;
    static CustomType = 5;

    constructor(page, opts) {
        this._page = page;
        this._opts = opts;
        this._latestTImestamp = 0;//最新消息的时间戳
        this._myHeadUrl = getApp().globalData.auth.avatar;
      this.nickname = getApp().globalData.auth.nickname
    }
    //获取content
    getContent(type, content) {
        let app = getApp();
        let str;
        
        switch (type) {
            case 1: str = content.text; break;
            case 2: str = content.url; break;
            case 3: str = content.url; break;
            case 4: str = content.url; break;
            case 5: str = content.url; break;
        } 
        return str;
    }
    getRoomId() {
        return this._opts.roomid
    }
    onSimulateReceiveMsg(cbOk) {
        //首次初始化  onSimulateReceiveMsg
        getApp().getIMHandler().setOnReceiveMessageListener({
            listener: (msg) => {
                if (!msg) {
                    return;
                }
              //console.log(msg);return;
                //如果是登陆 处理登陆信息
                if(msg.cmd == 1) {
                  this._page.setData({
                    msgsum: msg.data.msgsum,
                    cmtsum: msg.data.cmtsum,
                  });
                  //sum  一次拉5条
                  this.getHistory(msg.data.msgsum, this._page.data.getHistoryNum)
                  this.getPopSend(msg.data.cmtsum);
                  return;
                }
                const item = this.createReciveChatItem(msg.data);

                this._latestTImestamp = item.timestamp;
                //这里是收到好友消息的回调函数，建议传入的item是 由 createNormalChatItem 方法生成的。
                cbOk && cbOk(item,msg.cmd);
            }
        });

    }

    onSimulateSendMsg({content, success, fail}) {
        //这里content即为要发送的数据
        //这里的content是一个对象了，不再是一个JSON格式的字符串。这样可以在发送消息的底层统一处理。
        content = this._page.msgManager.getMsgManager({ type: content.type }).format(content);
    
        getApp().getIMHandler().sendMsg({
            content,
            success: (content) => {
                //这个content格式一样,也是一个对象
                const item = this.createNormalChatItem(content.data);
                this._latestTImestamp = item.timestamp;
                success && success(item);
            },
            fail
        });
    }
    getHistory(sum, length=10,success) {
      if(sum < 1) {
        return;
      }
      let start = sum - length + 1;
      let content = {
        cmd: 2,
        data: {
          roomid: this.getRoomId(),//好友id
          start: start,
          stop: sum
        }
      }
      this._page.setData({
        getHistoryNow: true
      })

      getApp().getIMHandler().sendMsg({
        content,
        success: (content) => {
          this._page.setData({
            msgsum: start - 1,
          })
          success && success(content);
        },
        fail: (res) => {

        }
      });
    }
    //拉取弹幕
    getPopSend(sum, length = 3, success) {
      let start = sum - length;
      let content = {
        cmd: 5,
        data: {
          roomid: this.getRoomId(),//好友id
          start: start,
          stop: sum
        }
      }

      getApp().getIMHandler().sendMsg({
        content,
        success: (content) => {
          
          success && success(content);
        },
        fail: (res) => {

        }
      });
    }
    //观众发送弹幕
  listenerSendMsg({ content, type = 1 }) {
    content = this.createChatItemContent({ type, content })
  
    content = this._page.msgManager.getMsgManager({ type: content.type }).format(content);
    content.cmd = 6;
    content.listener = 1; //标识听众
    getApp().getIMHandler().sendMsg({
      content,
      success: (content) => {

      }
    });
  }

  createChatItemContent({ type = IMOperator.TextType, content = '', duration = '', saveKey = 0, fileName = '', fileSize = 0} = {}) {
        if (!content.replace(/^\s*|\s*$/g, '')) return;
    
        return {
            content,
            type,
            conversationId: 0,//会话id，目前未用到
            userId: getApp().globalData.auth.id,
            roomid: this.getRoomId(),//好友id
            openid: this._opts.openid,
            duration: duration,
            saveKey: saveKey,
            headUrl: this._myHeadUrl,//显示的头像，自己或好友的。
          nickname: this.nickname,
          auth: this._opts.auth,
            fileName,
            fileSize
        };
    }

  createNormalChatItem({ type = 1, content = '', isMy = true, duration, fileName = '', fileSize = 0} = {}) {
        if (!content) return;
        const currentTimestamp = Date.now();
        const time = dealChatTime(currentTimestamp, this._latestTImestamp);
        let obj = {
            msgId: (new Date).getTime(),
            roomid: this.getRoomId(),
            isMy: isMy,//我发送的消息？
            showTime: time.ifShowTime,//是否显示该次发送时间
            time: time.timeStr,//发送时间 如 09:15,
            timestamp: currentTimestamp,//该条数据的时间戳，一般用于排序
            type: type,//内容的类型，目前有这几种类型： text/voice/image/custom | 文本/语音/图片/自定义
            content: content,// 显示的内容，根据不同的类型，在这里填充不同的信息。
            headUrl: this._myHeadUrl,//显示的头像，自己或好友的。
          nickname: this.nickname,
          auth: this._opts.auth,
            sendStatus: 'success',//发送状态，目前有这几种状态：sending/success/failed | 发送中/发送成功/发送失败
            voiceDuration: duration,//语音时长 单位秒
            isPlaying: false,//语音是否正在播放
          fileName: fileName,
          fileSize: fileSize
        };

        obj.saveKey = obj.roomid + this._opts.openid +'_' + obj.msgId;//saveKey是存储文件时的key
        return obj;
    }
    createReciveChatItem(msg) {
        if (!msg.content) return;
        const currentTimestamp = Date.now();
        const time = dealChatTime(currentTimestamp, this._latestTImestamp);
        let obj = {
            msgId: msg.msgid,
            isMy: false,//我发送的消息？
            showTime: time.ifShowTime,//是否显示该次发送时间
            time: time.timeStr,//发送时间 如 09:15,
            timestamp: currentTimestamp,//该条数据的时间戳，一般用于排序
            content: this.getContent(msg.type, msg.content),// 显示的内容，根据不同的类型，在这里填充不同的信息。
            // headUrl: isMy ? this._myHeadUrl : this._otherHeadUrl,//显示的头像，自己或好友的。
            headUrl: msg.headUrl,//显示的头像，自己或好友的。
          nickname: msg.nickname,
            sendStatus: 'success',//发送状态，目前有这几种状态：sending/success/failed | 发送中/发送成功/发送失败
            voiceDuration: msg.voiceDuration != undefined ? msg.voiceDuration : 0,//语音时长 单位秒
            isPlaying: false,//语音是否正在播放
        };
        obj.saveKey = msg.saveKey;   //saveKey是存储文件时的key
        let newresive = Object.assign(msg, obj);      
        
        return newresive;                         
    }
    static createCustomChatItem() {
        return {
            timestamp: Date.now(),
            type: IMOperator.CustomType,
            content: '会话已关闭'
        }
    }


    //登陆认证
    onLoginCb({success, fail}) {
        let content = {
            cmd: 1,
            data: {
                token: getApp().globalData.auth.token,
                roomid: this.getRoomId()
            }
        }
        
        getApp().getIMHandler().setOnLoginListener((fn) => {
            fn && fn({
              content, success, fail
            })
        })
    }
}

