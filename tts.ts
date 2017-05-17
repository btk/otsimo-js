

interface TTSDriver {

}


export class TTS {
    speak(text: string) {

    }
    setVoice(voice: string) {

    }
    getVoice(): string {
        return "";
    }
    voiceList(): string[] {
        return [];
    }
    setDriver(driver: TTSDriver) {

    }
    getDriver(): TTSDriver {
        return null;
    }
}
/*
 var tts = {
    __driver: null
  }
  tts.speak = function (text) {
    if (tts.__driver) {
      return tts.__driver.speak(text);
    }
    return new Error("TTS Driver is not set")
  }
  tts.setVoice = function (voice) {
    if (tts.__driver) {
      return tts.__driver.setVoice(voice);
    }
    return new Error("TTS Driver is not set")
  }
  tts.getVoice = function () {
    if (tts.__driver) {
      return tts.__driver.getVoice();
    }
    return new Error("TTS Driver is not set")
  }
  tts.voiceList = function () {
    if (tts.__driver) {
      return tts.__driver.voiceList();
    }
    return new Error("TTS Driver is not set")
  }
  tts.setDriver = function (driver) {
    tts.__driver = driver;
  }
  tts.getDriver = function () {
    return tts.__driver;
  }

*/