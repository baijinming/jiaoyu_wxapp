import IMOperator from "./im-operator";
import MsgTypeManager from "./msg-type/base/msg-type-manager";

export default class MsgManager extends MsgTypeManager {
    constructor(page) {
        super(page);
    }

    showMsg({msg}) {
        this.getMsgManager({type: msg.type}).showMsg({msg});
    }

  sendMsg({ type = IMOperator.TextType, content, duration, fileName, fileSize}) {
        this.getMsgManager({type}).sendOneMsg(arguments[0]);
    }
    sendPopMsg({ type = IMOperator.TextType, content, duration, is_line = true}) {
      this.getMsgManager({ type }).sendOneMsg(arguments[0]);
    }
    resend({ type, content, duration, itemIndex, saveKey}) {
        this.getMsgManager({type}).resend(arguments[0]);
    }
    
    stopAllVoice() {
        this.voiceManager.stopAllVoicePlay();
    }
}