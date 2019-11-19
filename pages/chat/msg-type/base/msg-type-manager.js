import IMOperator from "../../im-operator";
import VoiceManager from "../voice-manager";
import TextManager from "../text-manager";
import ImageManager from "../image-manager";
import CustomManager from "../custom-manager";
import FilesManager from "../files-manager";

export default class MsgTypeManager {
  constructor(page) {
    this.voiceManager = new VoiceManager(page);
    this.textManager = new TextManager(page);
    this.imageManager = new ImageManager(page);
    this.customManager = new CustomManager(page);
    this.filesManager = new FilesManager(page);
  }

  getMsgManager({
    type
  }) {
    let tempManager = null;
    switch (type) {
      case IMOperator.VoiceType:
        tempManager = this.voiceManager;
        break;
      case IMOperator.ImageType:
        tempManager = this.imageManager;
        break;
      case IMOperator.TextType:
        tempManager = this.textManager;
        break;
      case IMOperator.CustomType:
        tempManager = this.customManager;
        break;
      case IMOperator.FileType:
        tempManager = this.filesManager;
        break;
    }

    return tempManager;
  }

  clear() {
    this.voiceManager = null;
    this.textManager = null;
    this.imageManager = null;
    this.customManager = null;
  }
}