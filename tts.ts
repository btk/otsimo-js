interface TTSDriver {
  speak(text: string): void;
  voiceList(): string[];
  getVoice(): string;
  setVoice(voice: string): void;
}

export class TTS {

  private _driver: TTSDriver;

  speak(text: string) {
    if (this._driver) {
      return this._driver.speak(text);
    }
    console.error(new Error("TTS Driver is not set"));
  }

  setVoice(voice: string) {
    if (this._driver) {
      return this._driver.setVoice(voice);
    }
    console.error(new Error("TTS Driver is not set"));
  }

  getVoice(): string {
    if (this._driver) {
      return this._driver.getVoice();
    }
    console.error(new Error("TTS Driver is not set"));
    return "";
  }

  voiceList(): string[] {
    if (this._driver) {
      return this._driver.voiceList();
    }
    console.error(new Error("TTS Driver is not set"));
    return [];
  }

  setDriver(driver: TTSDriver) {
    this._driver = driver;
  }

  getDriver(): TTSDriver {
    return this._driver;
  }
}