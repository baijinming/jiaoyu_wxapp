import cryptoJS from './crypto.js';

// 数据加密
const encrypt = (key, data) => {
    // 对数据对象进行JSON化处理
    data = JSON.stringify(data);
    // 对JSON字符串进行加密处理
    return cryptoJS.encrypt(data, cryptoJS.AES, key);
}

// 数据解密
const decrypt = (key, ciphertext) => {
    // 对加密的密文进行解密处理
    var plaintext = cryptoJS.decrypt(ciphertext, cryptoJS.AES, key);
    console.log("【数据解密字符串】", plaintext);
    plaintext = getObject(plaintext);
    console.log("【数据解密】", plaintext);
    // 将字符串转为JSON对象返回
    return plaintext;
}

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const hasOwn = (obj, type) => {
    return Object.prototype.hasOwnProperty.call(obj, type);
}

const isEmpty = (item) => {
    item = getString(item);
    if ("" == strim(item))
        return true;
    return false;
}

const isUndefined = item => {
    return typeof item === 'undefined';
}

const isDefined = item => {
    return !isUndefined(item);
}
const isString = item => {
    return typeof item === 'string';
}
const isNumber = item => {
    return typeof item === 'number';
}
const isArray = item => {
    return Object.prototype.toString.apply(item) === '[object Array]';
}
const isObject = item => {
    return typeof item === 'object' && !isArray(item);
}
const isFunction = item => {
    return typeof item === 'function';
}

const getString = (item, defaultStr) => {
    if (isString(item)) return item.trim();
    if (isNumber(item)) return `${item}`.trim();
    return defaultStr || '';
}
const getNumber = (item, defaultNum) => {
    var matches = getString(item).match(/\d+/);
    return isNumber(matches && +matches[0]) ? +matches[0] : defaultNum;
}
const getArray = (item, defaultArr) => {
    item = strToObject(item);
    return isArray(item) ? item : (defaultArr || []);
}
const getObject = (item, defaultObj) => {
    item = strToObject(item);
    return item ? item : (defaultObj || {});
}
const getFunction = (item) => {
    return isFunction(item) ? item : noop;
}

const isEqual = (x, y) => {
    if (x === y) {
        return true;
    }

    if (!(x instanceof Object) || !(y instanceof Object)) {
        return false;
    }

    if (x.constructor !== y.constructor) {
        return false;
    }

    for (var p in x) {
        if (x.hasOwnProperty(p)) {
            if (!y.hasOwnProperty(p)) {
                return false;
            }
            if (x[p] === y[p]) {
                continue;
            }
            if (typeof (x[p]) !== "object") {
                return false;
            }
            if (!Object.equals(x[p], y[p])) {
                return false;
            }
        }
    }

    for (p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
            return false;
        }
    }
    return true;
}

const json = item => {
    let str = { type: Object.prototype.toString.call(item) }
    try {
        str = JSON.stringify(item)
    } catch (e) {
        str.error = e && e.stack || ''
    }
    return isString(str) ? str : $json(str)
}
const parse = item => {
    let obj = { type: Object.prototype.toString.call(item) }
    try {
        obj = JSON.parse(item)
    } catch (e) {
        obj.error = e && e.stack || ''
    }
    return isObject(obj) ? obj : $parse(obj)
}

const alert = (item = '标题', item2) => {
    const param = isObject(item) ? Object.assign({
        // 首参数为obj
        title: 'title', content: 'content'
    }, item) : isString(item) ? isString(item2) ? {
        // 俩参数均为字符串
        title: item, content: item2
    } : {
            // 只有首参为字符串
            title: '', content: item
        } : {
                // 尝试转换字符串
                title: item.toString ? item.toString() : '参数异常'
            }
    wx.showModal(Object.assign({
        showCancel: false
    }, param))
}

const isPhone = (str) => {
    return /^1\d{10}$/.test(str)
}

const isEmail = (str) => {
    return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(str)
}

const strToObject = (str) => {
    var res = undefined;
    if (isObject(str))
        return str;
    try {
        res = JSON.parse(str);
    } catch (e) {

    }
    if (!res instanceof Object) {
        res = undefined;
    }
    return res;
}

const trim = function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}
//删除左边的空格
const ltrim = function (str) {
    return str.replace(/(^\s*)/g, '');
}
//删除右边的空格
const rtrim = function (str) {
    return str.replace(/(\s*$)/g, '');
}
//去除所有空格
const strim = function (str) {
    return str.replace(/\s/g, '');
}
//字符串计算长度
const strlen = function (str) {
    var regch = /[\u4e00-\u9fa5]/;
    var length = 0;
    for (var i = 0; i < str.length; i++) {
        if (regch.test(str.charAt(i)) == true) {
            // 中文为2个字符
            length += 2;
        } else {
            // 英文一个字符
            length += 1;
        }
    }
    return length;
}

// 时间格式化
const timeformat = function (str, format, tissue) {
    var myDate = new Date();
    str = (str == 0 || !str || str == 'undefined' || str == NaN) ? myDate.getTime() : str;
    str = (typeof str == 'string') ? str.replace(/\-/g, '/') : str;
    (!format || format == '') ? format = 'y-m-d h:i:s' : format;
    var nowstamp = parseInt(myDate.getTime() / 1000),
        itemtime = parseInt(str),
        year, m, d, h, i, s;
    if (format == 'timestamp') {
        (str === +str) ? str = parseInt(str) : str = Date.parse(str);
        if (str > 100000000000) {
            str = str / 1000;
        }
        return str;
    }
    if (itemtime < 10000) {
        //普通时间直接转换
        itemtime = Date.parse(str);
    }
    if (itemtime > 100000000000) {
        itemtime = itemtime / 1000;
    }
    var timebe = nowstamp - itemtime;
    if (tissue && tissue > -1 && tissue < 864000 && timebe < tissue) {
        if (timebe > 86400) {
            //超过1天，按天计算
            return Math.floor(timebe / 86400) + '天前';
        } else if (timebe > 3600) {
            //超过1小时，按小时计算
            return Math.floor(timebe / 3600) + '小时前';
        } else if (timebe > 59) {
            //按分钟计算
            return Math.ceil(timebe / 60) + '分钟前';
        } else {
            return '刚刚';
        }
    } else {
        itemtime = myDate.setTime(itemtime * 1000);
        year = myDate.getFullYear();
        m = (myDate.getMonth() + 1 < 10) ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
        d = (myDate.getDate() < 10) ? '0' + (myDate.getDate()) : myDate.getDate();
        h = (myDate.getHours() < 10) ? '0' + (myDate.getHours()) : myDate.getHours();
        i = (myDate.getMinutes() < 10) ? '0' + (myDate.getMinutes()) : myDate.getMinutes();
        s = (myDate.getSeconds() < 10) ? '0' + (myDate.getSeconds()) : myDate.getSeconds();

        if ("object" == format.toLowerCase()) {
            return {
                year: year,
                mon: m,
                day: d,
                hour: h,
                min: i,
                sec: s
            };
        }

        return format.replace('y', year).replace('m', m).replace('d', d).replace('h', h).replace('i', i).replace('s', s);
    }
}

// 查看剩余时间
const leavetime = function (timeE, format) {
    timeE = timeformat(timeE || '2018-05-17 00:00:00', 'timestamp');//结束时间
    format = format || "string";
    var now = timeformat(0, 'timestamp');
    var timec = timeE - now; // 时间差值
    var day = '',
        hour = '',
        min = '',
        sec = '',
        d = 0,
        h = 0,
        m = 0,
        s = 0;
    if (timec > 86400) {
        d = Math.floor(timec / 86400);
        day = d > 0 ? d + '天' : '';
        timec = timec % 86400;
    }
    if (timec > 3600) {
        h = Math.floor(timec / 3600);
        hour = h > 0 ? h + '小时' : '';
        timec = timec % 3600;
    }
    if (timec > 59) {
        m = Math.floor(timec / 60);
        min = m > 0 ? m + '分钟' : '';
        timec = Math.floor(timec % 60);
    }
    if (timec > 0) {
        sec = timec + "秒";
    }

    if ("object" == format.toLowerCase()) {
        return {
            day: formatNumber(d),
            hour: formatNumber(h),
            min: formatNumber(m),
            sec: formatNumber(timec),
        };
    }
    return day + hour + min + sec;
}

const HTMLDecode = (str) => {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&gt;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br>/g, "\n");
    return s;
}

const isUrl = (str) => {
    return /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(str);
}

const page = () => {
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = "/" == currentPage.route.substr(0, 1) ? currentPage.route : "/" + currentPage.route;
    return {
        pages: pages,
        current: currentPage,
        url: url,
        options: currentPage.options
    }
}


module.exports = {
    encrypt: encrypt,
    decrypt: decrypt,
    formatTime: formatTime,
    formatNumber: formatNumber,
    hasOwn: hasOwn,
    isUndefined: isUndefined,
    isDefined: isDefined,
    isString: isString,
    isNumber: isNumber,
    isArray: isArray,
    isObject: isObject,
    isFunction: isFunction,
    getString: getString,
    getNumber: getNumber,
    getArray: getArray,
    getObject: getObject,
    getFunction: getFunction,
    json: json,
    parse: parse,
    alert: alert,
    isPhone: isPhone,
    isEmail: isEmail,
    strToObject: strToObject,
    trim: trim,
    ltrim: ltrim,
    rtrim: rtrim,
    strim: strim,
    strlen: strlen,
    leavetime: leavetime,
    timeformat: timeformat,
    HTMLDecode: HTMLDecode,
    isUrl: isUrl,
    isEmpty: isEmpty,
    isEqual: isEqual,
    page: page,
}
