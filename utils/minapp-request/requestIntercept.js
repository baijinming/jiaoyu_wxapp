//请求拦截器定义
/*
 * @description: 网络请求拦截器（注意拦截器中的this是指向minapp-api-promise实例本身）
 * @Author: yangchunfu
 */
export default {
  // 发出请求时的回调函数
  config(config) {
    // 请求前设置token
    let token = getApp().getUserToken();

    // if(!token) {
    //     //如果token不存在 ，跳转到登录页
    //     this.redirectTo({
    //         url: '/pages/choose-school/index'
    //     })
    // }
    // }
    // if (token) {
    //     config.data = Object.assign(config.data, {
    //         token: token
    //     })

    // }

    config.header['http-token'] = token
    return config
  },

  // 请求成功后的回调函数
  success(resp) {
    this.hideLoading()
    let errorMesg = ''
    // 可以在这里对收到的响应数据对象进行加工处理
    switch (resp.statusCode) {
      case 200:
        break
      case 401:
        //登陆
        this.redirectTo({
          url: '/pages/choose-school/index2'
        })
        break;
      case 403:
        console.log('未授权接口,拦截')
        this.showModal({
          title: '警告',
          content: (resp.data.msg) || '无权请联系管理员',
          confirmText: '我知道了',
          showCancel: false
        })
        throw new Error(resp.data.msg)
      case 500:
      case 502:
        errorMesg = resp.data.msg || '服务器出错'
        break
      case 503:
        errorMesg = '哦～服务器宕机了'
        break
    }
    if (errorMesg.length > 0) {
      this.showToast({
        title: errorMesg,
        icon: 'none'
      })
      throw new Error(errorMesg)
    }
    return resp
  },

  fail(resp) {
    this.showToast({
      title: '网络连接失败',
      icon: 'none'
    })
  },
  complete: (res) => {
    console.log('1111111111111111')
    // 控制台调试日志
    // 隐藏加载提示
    wx.hideNavigationBarLoading();
    // 停止下拉状态
    wx.stopPullDownRefresh();
  }
}