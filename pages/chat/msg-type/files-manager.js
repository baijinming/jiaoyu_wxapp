
import FileManager from "./base/file-manager.js";

export default class FilesManager extends FileManager {
  constructor(page) {
    super(page);
    this._page.fileClickEvent = function (e) {
      console.log(e)
      let url = e.currentTarget.dataset.url;
      console.log(url)
      wx.openDocument({
        filePath: url, //要打开的文件路径
        success: function (res) {
          console.log('打开文件成功');
        }
      })
    }
  }


  //把消息处理成当前项目 所需要的格式
  format(content) {
    let obj = {
      cmd: 3,
      data: {
        roomid: content.roomid,
        type: 3,
        saveKey: content.saveKey,
        headUrl: content.headUrl,
        fileName: content.fileName,
        fileSize: content.fileSize,
        nickname: content.nickname,
        openid: getApp().globalData.auth.openid,
        auth: content.auth,
        content: content
      }
    }
    return obj;
  }
}