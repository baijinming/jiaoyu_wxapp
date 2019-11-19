import WXP from './minapp-request/wxp.min.js'
import requestIntercept from './minapp-request/requestIntercept.js'
import util from './util.js'

const apiurl = 'http://huiyijia.pxuc.com.cn/api/';
const host = 'http://huiyijia.pxuc.com.cn';
const image_url = 'http://huiyijia.pxuc.com.cn';
const oss_url = 'http://caierimgs.oss-cn-beijing.aliyuncs.com';
// 注册请求拦截器
WXP.intercept('request', requestIntercept);
const $ajax = (
    {    
        url = '',
        data = {},
        methods = 'POST',
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        loading = '加载中...'
    },
    {
        success = undefined,
        fail = undefined,
        complete = undefined
    } = {}, //默认为空对象
) => {
    // 增强体验：加载中
    wx.showNavigationBarLoading();
    if (loading && loading !== false) {
        WXP.showLoading({
            title: loading,
            icon: 'none'
        })
    }
   
    // 构造请求体
    let request = {
        url: url.indexOf(apiurl) > -1 ? url : apiurl + url,
        method: methods,
        header: Object.assign({
            // set something global
        }, headers),
        data: Object.assign({

        }, data)
    }
     
    WXP.request(Object.assign(request)).then(resp => {
        //大于0代表成功  200
        if(resp.data.code > 0) {
            if (util.isFunction(success)) {
                success(resp.data)
            } else {
                wx.showToast({
                    title: resp.data.msg,
                    icon: 'none'
                })
            }  
        } else {
            if (util.isFunction(fail)) {
                fail(resp.data)
            } else {
                wx.showToast({
                    title: resp.data.msg,
                    icon: 'none'
                })
            } 
        }
        if (util.isFunction(complete)) {
            complete(resp.data)
        } 
    }).catch(errorMesg => {
        // 隐藏加载提示 
        console.log(errorMesg)
        if (util.isFunction(complete)) {
          complete(errorMesg)
        }
    })
}

const complete = function(that, res, app, page = 15) {
    let tip = '';
    if (app.util.isString(res)) {
        app.info(res);
        tip = '上拉加载';
        that.data.is_pull = true;
    } else if (!app.util.isUndefined(res.data) && app.util.isArray(res.data.data)) {
        if (res.data.data.length < page) {
            that.data.is_pull = false;
            tip = '没有更多数据'
        } else {
            tip = '上拉加载';
            that.data.is_pull = true;
        }
    }
    that.setData({
        loading: false,
        tip: tip,
    })
}

module.exports = { 
    $ajax: $ajax,
    apiurl: apiurl,
    host: host,
    image_url: image_url,
    oss_url: oss_url,
    WXP: WXP, 
    complete
}

