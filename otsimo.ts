
import { TTS } from './tts';
import { Speech } from './speech';
import { Camera } from './camera';
import { ML } from './ml';

interface Child {
    firstname: string;
    lastname: string;
    id: string;
    gameid: string;
    language: string;
}

interface InitOptions {
    firstname?: string
    lastname?: string
    childid?: string;
    gameid?: string;
    language?: string;
    width?: number;
    height?: number;
    capabilities?: string[];
    debug?: boolean;
}

function navigatorLanguages(nav: any): string[] {
    let found = [];
    if (typeof nav.languages !== "undefined") { // chrome only; not an array, so can't use .push.apply instead of iterating
        for (var i = 0; i < nav.languages.length; i++) {
            found.push(nav.languages[i]);
        }
    }
    if (typeof nav.userLanguage !== "undefined") {
        found.push(nav.userLanguage);
    }
    if (nav.language) {
        found.push(nav.language);
    }
    return found;
}

interface SettingsCallback {
    (setting: any, sound: boolean): void;
}

interface ResoulutionCallback {
    (width: number, height: number, orientation: string): void;
}

class OtsimoHelper {
    settings: Object = {}
    kv: any = null
    child: Child = null;
    manifest: any = {}
    tts = new TTS();
    ml = new ML();
    camera = new Camera();
    speech = new Speech();

    private _debug = false
    private _sound = true
    private _width: number = 1024;
    private _height: number = 768;
    private _isLoaded: boolean = false;
    private _settingsCallbacks: SettingsCallback[] = [];
    private _resoulutionCallbacks: ResoulutionCallback[] = [];


    constructor() {
        /*if (this.android) {
            document.addEventListener('message', function (e) {
                try {
                    var messageData = JSON.parse(e.data);
                    var fn = otemp[messageData.func];
                    if (typeof fn === 'function') {
                        fn.apply(otemp, messageData.args);
                    }
                } catch (err) {
                    console.warn(err);
                }
            });
        }*/
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get isWKWebView(): boolean {
        let w = window as any;
        return !!(w.webkit && w.webkit.messageHandlers)
    }

    get iOS(): boolean {
        return (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false)
    }

    get android(): boolean {
        return /OtsimoChildApp\/[0-9\.]+$/.test(navigator.userAgent);
    }

    log() {
    }

    customevent(eventName: string, data?: Object) {

    }

    quitgame() {

    }

    run(cb: () => void) {

    }

    onSettingsChanged(cb: SettingsCallback) {
        this._settingsCallbacks.push(cb);
    }

    onResolutionChanged(cb: ResoulutionCallback) {
        this._resoulutionCallbacks.push(cb);
    }

    init(options?: InitOptions) {

    }

    getLanguages(): string[] {
        let found: string[] = []
        if (typeof navigator !== 'undefined') {
            found = navigatorLanguages(navigator);
        }
        for (var iif = 0; iif < found.length; iif++) {
            if (found[iif].indexOf("-") > -1) {
                found[iif] = found[iif].split("-")[0];
            }
        }
        return found
    }

    private makeid(length?: number) {
        if (!length) {
            length = 5;
        }
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

}

export const otsimo = new OtsimoHelper();
