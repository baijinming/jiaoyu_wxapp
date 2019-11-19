let _page;
let inputObj = {},
  recorderManager;
let windowHeight, windowWidth;
// let voice$position = {toLeft: 0, toBottom: 0};
let singleVoiceTimeCount = 0;
let maxVoiceTime = 60,
  minVoiceTime = 1,
  startTimeDown = 54;
let timer;
let sendVoiceCbOk, sendVoiceCbError, startVoiceRecordCbOk, tabbarHeigth = 0,
  extraButtonClickEvent, canUsePress = false,
  voiceFormat;
let cancelLineYPosition = 0;
let status = {
  START: 1,
  SUCCESS: 2,
  CANCEL: 3,
  SHORT: 4,
  FAIL: 5,
  UNAUTH: 6
};

// let isRecordAuth = false;
let voiceFile;

function init(page, opt) {
  windowHeight = opt.systemInfo.windowHeight;
  windowWidth = opt.systemInfo.windowWidth;
  canUsePress = opt.systemInfo.SDKVersion > '1.5.0';
  minVoiceTime = opt.minVoiceTime ? opt.minVoiceTime : 1;
  maxVoiceTime = opt.maxVoiceTime && opt.maxVoiceTime <= 60 ? opt.maxVoiceTime : 60;
  voiceFormat = opt.format || 'mp3';
  startTimeDown = opt.startTimeDown && opt.startTimeDown < maxVoiceTime && opt.startTimeDown > 0 ? opt.startTimeDown : 54;
  if (!isNaN(opt.tabbarHeigth)) {
    tabbarHeigth = opt.tabbarHeigth;
  }
  if (!windowHeight || !windowWidth) {
    console.error('没有获取到手机的屏幕尺寸：windowWidth', windowWidth, 'windowHeight', windowHeight);
    return;
  }
  _page = page;
  initData(opt);
  initVoiceData();
  initExtraData(opt.extraArr);

  initChangeInputWayEvent();
  if (wx.getRecorderManager) {
    recorderManager = wx.getRecorderManager();
    dealVoiceLongClickEventWithHighVersion();
  } else {
    dealVoiceLongClickEventWithLowVersion();
  }
  dealVoiceMoveEvent();
  dealVoiceMoveEndEvent();
  _page.setData({
    'inputObj.lookArr': lookArr
  })
}

function clickExtraItemListener(cb) {
  _page.chatInputExtraItemClickEvent = typeof cb === "function" ? cb : null;
}

function sendVoiceListener(cbOk, cbError) {
  sendVoiceCbError = cbError;
  sendVoiceCbOk = cbOk;
  if (!!recorderManager) {
    typeof cbOk === "function" && (recorderManager.onStop(function(res) {
      voiceFile = res;
      console.log(voiceFile)
      _page.innerAudioIsPlaying = false;
      _page.setData({
        'inputObj.voiceObj.voiceStatusStop': true
      })
    }));
    typeof cbError === "function" && (recorderManager.onError(function(res) {
      typeof startVoiceRecordCbOk === "function" && startVoiceRecordCbOk(status.FAIL);
      typeof sendVoiceCbError === "function" && sendVoiceCbError(res);
    }));
  }
}

function setVoiceRecordStatusListener(cb) {
  startVoiceRecordCbOk = cb;
}

function initChangeInputWayEvent() {
  _page.changeInputWayEvent = function() {
    _page.setData({
      'inputObj.inputStatus': _page.data.inputObj.inputStatus === 'text' ? 'voice' : 'text',
      'inputObj.extraObj.chatInputShowExtra': false
    });
  };
  _page.setData({
    'inputObj.category': 0,
  })
  // 操作选择
  _page.changeCategoryWay = function(e) {
    let index = e.currentTarget.dataset.index;
    _page.setData({
      'inputObj.category': index,
    })
    if(index == 4) {
      _page.setData({
        'inputObj.extraObj.chatInputShowExtra': !_page.data.inputObj.extraObj.chatInputShowExtra
      });
      extraButtonClickEvent && extraButtonClickEvent(!_page.data.inputObj.extraObj.chatInputShowExtra);
    } else {
      _page.setData({
        'inputObj.extraObj.chatInputShowExtra': false
      });
    }
  }
}

function initVoiceData() {
  let width = windowWidth / 2.6;
  _page.setData({
    'inputObj.inputStyle': _page.data.inputObj.inputStyle,
    'inputObj.canUsePress': canUsePress,
    'inputObj.inputStatus': 'text',
    'inputObj.windowHeight': windowHeight,
    'inputObj.windowWidth': windowWidth,
    'inputObj.voiceObj.status': 'end',
    'inputObj.voiceObj.startStatus': 0,
    'inputObj.voiceObj.voicePartWidth': width,
    'inputObj.voiceObj.moveToCancel': false,
    'inputObj.voiceObj.voicePartPositionToBottom': (windowHeight - width / 2.4) / 2,
    'inputObj.voiceObj.voicePartPositionToLeft': (windowWidth - width) / 2,
    'inputObj.voiceObj.voiceStatusStop': false,
    'inputObj.voiceObj.vocieHasTime': 1
  });
  cancelLineYPosition = windowHeight * 0.12;
}

function setExtraButtonClickListener(fun) {
  extraButtonClickEvent = fun;
}

function initExtraData(extra$arr) {
  _page.setData({
    'inputObj.extraObj.chatInputExtraArr': extra$arr
  });
  _page.chatInputExtraClickEvent = function() {
    _page.setData({
      'inputObj.extraObj.chatInputShowExtra': !_page.data.inputObj.extraObj.chatInputShowExtra
    });
    extraButtonClickEvent && extraButtonClickEvent(!_page.data.inputObj.extraObj.chatInputShowExtra);
  };
}

function dealVoiceLongClickEventWithHighVersion() {
  recorderManager.onStart(function() {
    console.log('awfeaf')
    singleVoiceTimeCount = 1;
    //设置定时器计时60秒
    timer = setInterval(function () {
      singleVoiceTimeCount++;
      _page.setData({
        'inputObj.voiceObj.vocieHasTime': singleVoiceTimeCount
      })
      if (singleVoiceTimeCount >= startTimeDown && singleVoiceTimeCount < maxVoiceTime) {
        _page.setData({
          'inputObj.voiceObj.timeDownNum': maxVoiceTime - singleVoiceTimeCount,
          'inputObj.voiceObj.status': 'timeDown'
        })
      } else if (singleVoiceTimeCount >= maxVoiceTime) {
        _page.setData({
          'inputObj.voiceObj.status': 'timeout'
        });
        delayDismissCancelView();
        clearInterval(timer);
        //TODO 停止录音并生成IM语音信息 并将时长拼入到IM消息中
        endRecord();
      }
    }, 1000);
  })
  _page.long$click$voice$btn = function(e) {
    if ('send$voice$btn' === e.currentTarget.id) { //长按时需要打开录音功能，开始录音
      _page.setData({ //调出取消弹窗
        'inputObj.voiceObj.showCancelSendVoicePart': true,
        'inputObj.voiceObj.timeDownNum': maxVoiceTime - singleVoiceTimeCount,
        'inputObj.voiceObj.status': 'start',
        'inputObj.voiceObj.startStatus': 1,
        'inputObj.voiceObj.moveToCancel': false
      });
      typeof startVoiceRecordCbOk === "function" && startVoiceRecordCbOk(status.START);
      checkRecordAuth(function() {
        recorderManager.start({
          duration: 60000,
          format: voiceFormat
        });
      }, function(res) {
        //录音失败
        console.error('录音拒绝授权');
        clearInterval(timer);
        endRecord();
        _page.setData({
          'inputObj.voiceObj.status': 'end',
          'inputObj.voiceObj.showCancelSendVoicePart': false
        });
        typeof startVoiceRecordCbOk === "function" && startVoiceRecordCbOk(status.UNAUTH);

        if (!sendVoiceCbError) {
          if (wx.openSetting) {
            wx.showModal({
              title: '您未授权语音功能',
              content: '暂时不能使用语音',
              confirmText: '去设置',
              success: res => {
                if (res.confirm) {
                  wx.openSetting({
                    success: res => {
                      if (res.authSetting['scope.record']) {
                        _page.setData({
                          'inputObj.extraObj.chatInputShowExtra': false
                        });
                      }
                    }
                  });
                } else {
                  _page.setData({
                    'inputObj.inputStatus': 'text',
                    'inputObj.extraObj.chatInputShowExtra': false
                  });
                }
              }
            });

          } else {
            wx.showModal({
              title: '无法使用语音',
              content: '请将微信升级至最新版本才可使用语音功能',
              success: res => {
                if (res.confirm) {

                }
              }
            })
          }
        } else {
          typeof sendVoiceCbError === "function" && sendVoiceCbError(res);
        }
      });
    }
  };
  // 试听录音
  _page.auditionVoiceWay = function() {
    _page.innerAudioContext = wx.createInnerAudioContext();
    _page.innerAudioContext.src = voiceFile.tempFilePath;
    _page.innerAudioContext.startTime = 0;
    if(_page.innerAudioIsPlaying) {
      _page.innerAudioContext.stop()
    } else {
      _page.innerAudioContext.play()
    }
    _page.innerAudioIsPlaying = !_page.innerAudioIsPlaying
  };
  // 重录
  _page.recordVoiceWay = function() {
    _page.innerAudioContext.stop()
    _page.setData({
      'inputObj.voiceObj.voiceStatusStop': false,
      'inputObj.voiceObj.vocieHasTime': 1,
      'inputObj.voiceObj.showCancelSendVoicePart': false
    })
  };
  // 发送录音
  _page.sendVoiceWay = function() {
    let res = voiceFile;
    console.log(res, _page.data.inputObj.voiceObj.status);
    if (_page.data.inputObj.voiceObj.status === 'short') { //录音时间太短或者移动到了取消录音区域， 则取消录音
      typeof startVoiceRecordCbOk === "function" && startVoiceRecordCbOk(status.SHORT);
      return;
    } else if (_page.data.inputObj.voiceObj.moveToCancel) {
      typeof startVoiceRecordCbOk === "function" && startVoiceRecordCbOk(status.CANCEL);
      return;
    }
    console.log('录音成功');
    typeof startVoiceRecordCbOk === "function" && startVoiceRecordCbOk(status.SUCCESS);
    typeof sendVoiceCbOk === "function" && sendVoiceCbOk(res, Math.round(res.duration / 1000));
    _page.setData({
      'inputObj.voiceObj.voiceStatusStop': false,
      'inputObj.voiceObj.vocieHasTime': 1,
      'inputObj.voiceObj.showCancelSendVoicePart': false,
      'inputObj.category': 0,
    })
  }
}

function dealVoiceLongClickEventWithLowVersion() {
  _page.long$click$voice$btn = function(e) {
    if ('send$voice$btn' === e.currentTarget.id) { //长按时需要打开录音功能，开始录音
      singleVoiceTimeCount = 0;
      _page.setData({ //调出取消弹窗
        'inputObj.voiceObj.showCancelSendVoicePart': true,
        'inputObj.voiceObj.timeDownNum': maxVoiceTime - singleVoiceTimeCount,
        'inputObj.voiceObj.status': 'start',
        'inputObj.voiceObj.startStatus': 1,
        'inputObj.voiceObj.moveToCancel': false
      });
      typeof startVoiceRecordCbOk === "function" && startVoiceRecordCbOk(status.START);
      checkRecordAuth(function() {
        wx.startRecord({
          success: function(res) {
            console.log(res, _page.data.inputObj.voiceObj.status);
            if (_page.data.inputObj.voiceObj.status === 'short') { //录音时间太短或者移动到了取消录音区域， 则取消录音
              typeof startVoiceRecordCbOk === "function" && startVoiceRecordCbOk(status.SHORT);
              return;
            } else if (_page.data.inputObj.voiceObj.moveToCancel) {
              typeof startVoiceRecordCbOk === "function" && startVoiceRecordCbOk(status.CANCEL);
              return;
            }
            console.log('录音成功');
            typeof startVoiceRecordCbOk === "function" && startVoiceRecordCbOk(status.SUCCESS);
            typeof sendVoiceCbOk === "function" && sendVoiceCbOk(res, singleVoiceTimeCount + '');
          },
          fail: res => {
            typeof startVoiceRecordCbOk === "function" && startVoiceRecordCbOk(status.FAIL);
            typeof sendVoiceCbError === "function" && sendVoiceCbError(res);
          }
        });
        //设置定时器计时60秒
        timer = setInterval(function() {
          singleVoiceTimeCount++;
          if (singleVoiceTimeCount >= startTimeDown && singleVoiceTimeCount < maxVoiceTime) {
            _page.setData({
              'inputObj.voiceObj.timeDownNum': maxVoiceTime - singleVoiceTimeCount,
              'inputObj.voiceObj.status': 'timeDown'
            })
          } else if (singleVoiceTimeCount >= maxVoiceTime) {
            _page.setData({
              'inputObj.voiceObj.status': 'timeout'
            });
            delayDismissCancelView();
            clearInterval(timer);
            //TODO 停止录音并生成IM语音信息 并将时长拼入到IM消息中
            endRecord();
          }
        }, 1000);
      }, function(res) {
        //录音失败
        console.error('录音拒绝授权');
        clearInterval(timer);
        endRecord();
        _page.setData({
          'inputObj.voiceObj.status': 'end',
          'inputObj.voiceObj.showCancelSendVoicePart': false
        });
        typeof startVoiceRecordCbOk === "function" && startVoiceRecordCbOk(status.UNAUTH);

        if (!sendVoiceCbError) {
          if (wx.openSetting) {
            wx.showModal({
              title: '您未授权语音功能',
              content: '暂时不能使用语音',
              confirmText: '去设置',
              success: res => {
                if (res.confirm) {
                  wx.openSetting({
                    success: res => {
                      if (res.authSetting['scope.record']) {
                        _page.setData({
                          'inputObj.extraObj.chatInputShowExtra': false
                        });
                      }
                    }
                  });
                } else {
                  _page.setData({
                    'inputObj.inputStatus': 'text',
                    'inputObj.extraObj.chatInputShowExtra': false
                  });
                }
              }
            });

          } else {
            wx.showModal({
              title: '无法使用语音',
              content: '请将微信升级至最新版本才可使用语音功能',
              success: res => {
                if (res.confirm) {

                }
              }
            })
          }
        } else {
          typeof sendVoiceCbError === "function" && sendVoiceCbError(res);
        }
      });
    }
  };
}

function dealVoiceMoveEvent() {
  _page.send$voice$move$event = function(e) {
    if ('send$voice$btn' === e.currentTarget.id) {
      let y = windowHeight + tabbarHeigth - e.touches[0].clientY;
      if (y > cancelLineYPosition) {
        if (!inputObj.voiceObj.moveToCancel) {
          _page.setData({
            'inputObj.voiceObj.moveToCancel': true
          });
        }
      } else {
        if (inputObj.voiceObj.moveToCancel) { //如果移出了该区域
          _page.setData({
            'inputObj.voiceObj.moveToCancel': false
          })
        }
      }

    }
  };
}

function dealVoiceMoveEndEvent() {
  // 发送语音
  _page.send$voice$move$end$event = function(e) {
    if ('send$voice$btn' === e.currentTarget.id) {
      if (singleVoiceTimeCount < minVoiceTime) { //语音时间太短
        _page.setData({
          'inputObj.voiceObj.status': 'short'
        });
        delayDismissCancelView();
      } else { //语音时间正常
        _page.setData({
          'inputObj.voiceObj.showCancelSendVoicePart': false,
          'inputObj.voiceObj.status': 'end'
        });
      }
      if (timer) { //关闭定时器
        clearInterval(timer);
      }
      endRecord();
    }
  }
}

function checkRecordAuth(cbOk, cbError) {
  if (getApp().getNetworkConnected) {
    if (wx.getSetting) {
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.record']) {
            wx.authorize({
              scope: 'scope.record',
              success(res) {
                // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                console.log('同意', res);
              },
              fail: res => {
                console.log('拒绝', res);
                cbError && cbError();
              }
            })
          } else {
            cbOk && cbOk();
          }
        }
      })
    } else {
      wx.showModal({
        title: '无法使用语音',
        content: '请将微信升级至最新版本才可使用语音功能',
        success: res => {
          if (res.confirm) {

          }
        }
      })
    }
  } else {
    cbOk && cbOk();
  }
}

function closeExtraView() {
  _page.setData({
    'inputObj.extraObj.chatInputShowExtra': false
  });
}

function delayDismissCancelView() {
  setTimeout(function() {
    if (inputObj.voiceObj.status !== 'start') {
      _page.setData({
        'inputObj.voiceObj.showCancelSendVoicePart': false,
        'inputObj.voiceObj.status': 'end'
      });
    }
  }, 1000)
}

function initData(opt) {
  _page.data.inputObj = inputObj = {
    voiceObj: {},
    inputStyle: {
      sendButtonBgColor: opt.sendButtonBgColor || 'mediumseagreen',
      sendButtonTextColor: opt.sendButtonTextColor || 'white'
    }
  };
}

function endRecord() {
  _page.setData({
    'inputObj.voiceObj.startStatus': 0
  });
  if (!recorderManager) {
    wx.stopRecord();
  } else {
    recorderManager.stop();
  }
}

function setTextMessageListener(cb) {
  if (_page) {
    _page.chatInputBindFocusEvent = function() {
      _page.setData({
        'inputObj.inputType': 'text'
      })
    };
    _page.chatInputBindBlurEvent = function() {
      setTimeout(() => {
        let obj = {};
        if (!inputObj.inputValueEventTemp) {
          inputObj.inputValueEventTemp = null;
          obj['inputObj.inputType'] = 'none';
        }
        obj['inputObj.extraObj.chatInputShowExtra'] = false;
        _page.setData(obj);
      });
    };
    _page.chatInputSendTextMessage = function(e) {
      _page.setData({
        textMessage: ''
      });
      typeof cb === "function" && cb(e);
    };
    _page.chatInputSendTextMessage02 = function() {
      if (!!inputObj.inputValueEventTemp) {
        typeof cb === "function" && cb(inputObj.inputValueEventTemp);
      }

      _page.setData({
        textMessage: '',
        'inputObj.inputType': 'none'
      });
      inputObj.inputValueEventTemp = null;

    }
    // 发送表情---本质仍然是文本
    _page.chatInputSendLook = function(e) {
      let look = e.currentTarget.dataset.look;
      typeof cb === "function" && cb(look);
      _page.setData({
        'inputObj.category': 0,
      })
    }
    //解决事件无效问题
    // _page.chatInputGetValueEvent = function (e) {

    //     inputObj.inputValueEventTemp = e;
    //     _page.setData({
    //         textMessage: e.detail.value
    //     });
    // }  
  }
}

function chatInputGetValueEvent(e) {
  console.log(e)
  let obj = JSON.parse(JSON.stringify(e))
  inputObj.inputValueEventTemp = e.detail.value;
  _page.setData({
    textMessage: e.detail.value
  });
}

function isVoiceRecordUseLatestVersion() {
  return !!recorderManager;
}

module.exports = {
  init: init,
  clickExtraListener: clickExtraItemListener,
  closeExtraView: closeExtraView,
  recordVoiceListener: sendVoiceListener,
  setVoiceRecordStatusListener: setVoiceRecordStatusListener,
  setTextMessageListener: setTextMessageListener,
  setExtraButtonClickListener: setExtraButtonClickListener,
  isVoiceRecordUseLatestVersion: isVoiceRecordUseLatestVersion,
  VRStatus: status,
  chatInputGetValueEvent
};

let lookArr = ['😀', '😁', '😂', '😅', '😊', '🤗', '😍', '😘', '😑', '🙄', '😪', '😝', '😒', '😟', '😬', '😵', '😰', '😶', '🤐', '😴', '😝', '🤑', '😤', '😨', '😷', '😇', '🤢','🤓']