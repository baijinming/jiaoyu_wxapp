
import FileManager from "./base/file-manager.js";

export default class ImageManager extends FileManager {
  constructor(page) {
    super(page);
    this._page.imageClickEvent = function(e) {
      wx.previewImage({
        current: e.currentTarget.dataset.url, // 当前显示图片的http链接
        urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
      })
    }
  }


  //把消息处理成当前项目 所需要的格式
  format(content) {
    let obj = {
      cmd: 3,
      data: {
        roomid: content.roomid,
        type: 4,
        saveKey: content.saveKey,
        headUrl: content.headUrl,
        nickname: content.nickname,
        auth: content.auth,
        openid: getApp().globalData.auth.openid,
        content: {
          url: content.content
        }
      }
    }
    return obj;
  }
}