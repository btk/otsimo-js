
import { TTS } from './tts';
import { Speech } from './speech';
import { Camera } from './camera';
import { ML } from './ml';
import { Child, GameManifest, Otsimo, InitOptions, SettingsCallback, ResoulutionCallback } from './common';

interface NativeInitOptions {
    child: Child;
    sound: boolean;
    settings: Object;
    root: string;
    capabilities?: string[];
    screen: { width: number, height: number }
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

export class OtsimoHelper implements Otsimo<ML, TTS, Camera, Speech> {
    settings: Object = {}
    kv: any = null
    child: Child = null;
    manifest: GameManifest = null;

    private _tts = new TTS();
    private _ml = new ML(this);
    private _camera = new Camera(this);
    private _speech = new Speech(this);

    private _debug = false
    private _sound = true
    private _root = "";
    private _width: number = 1024;
    private _height: number = 768;
    private _isLoaded: boolean = false;
    private _capabilities: string[] = ["sandbox"];
    private _settingsCallbacks: SettingsCallback[] = [];
    private _resoulutionCallbacks: ResoulutionCallback[] = [];
    private _callbackStack: (() => void)[] = [];

    constructor() {
        if (this.android) {
            this.registerAndroidMessages();
        }
    }

    get ml(): ML {
        return this._ml;
    }

    get tts(): TTS {
        return this._tts;
    }

    get camera(): Camera {
        return this._camera;
    }

    get speech(): Speech {
        return this._speech;
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

    get capabilities(): string[] {
        return this._capabilities;
    }

    log(message?: any, ...optionalParams: any[]) {
        console.log.apply(console, arguments);
        let w: any = window;
        if (this.isWKWebView) {
            w.webkit.messageHandlers.console.postMessage(JSON.stringify(arguments));
        } else if (this.android) {
            w.postMessage(JSON.stringify({ "action": "log", "arguments": arguments }), "*");
        }
    }

    customevent(eventName: string, data?: Object) {
        var _nd = {};
        Object.keys(data).forEach(function (k) {
            if (typeof data[k] !== 'undefined') {
                _nd[k] = data[k];
            }
        });
        if (this.isWKWebView) {
            let w: any = window;
            w.webkit.messageHandlers.analytics.postMessage({
                event: eventName,
                data: _nd
            });
        } else if (this.android) {
            window.postMessage(JSON.stringify({ action: "customevent", event: eventName, data: _nd }), "*");
        } else {
            this.log("customevent", eventName, _nd)
        }
    }

    quitgame() {
        if (this.isWKWebView) {
            let w: any = window;
            w.webkit.messageHandlers.player.postMessage({
                event: "quitgame"
            });
        } else if (this.android) {
            window.postMessage(JSON.stringify({ action: "quitgame" }), "*");
        } else {
            this.log('quit game called');
        }
    }

    run(cb: () => void) {
        this.log("register function to run")
        if (this._isLoaded) {
            cb();
        } else {
            this._callbackStack.push(cb);
        }
    }

    onSettingsChanged(cb: SettingsCallback) {
        this._settingsCallbacks.push(cb);
    }

    onResolutionChanged(cb: ResoulutionCallback) {
        this._resoulutionCallbacks.push(cb);
    }

    getAllUrlParams() {
        // get query string from url (optional) or window
        let queryString = window.location.search.slice(1);

        // we'll store the parameters here
        let obj = {};
        // if query string exists
        if (queryString) {

            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];

            // split our query string into its component parts
            var arr = queryString.split('&');

            for (var i = 0; i < arr.length; i++) {
                // separate the keys and the values
                var a = arr[i].split('=');

                // in case params look like: list[]=thing1&list[]=thing2
                var paramNum = undefined;
                var paramName = a[0].replace(/\[\d*\]/, function (v) {
                    paramNum = v.slice(1, -1);
                    return '';
                });

                // set parameter value (use 'true' if empty)
                var paramValue = typeof (a[1]) === 'undefined' ? 'true' : a[1];

                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                paramValue = paramValue.toLowerCase();

                // if parameter name already exists
                if (obj[paramName]) {
                    // convert value to array (if still string)
                    if (typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                    }
                    // if no array index number specified...
                    if (typeof paramNum === 'undefined') {
                        // put the value on the end of the array
                        obj[paramName].push(paramValue);
                    }
                    // if array index number specified...
                    else {
                        // put the value at that index number
                        obj[paramName][paramNum] = paramValue;
                    }
                }
                // if param name doesn't exist yet, set it
                else {
                    obj[paramName] = paramValue;
                }
            }
        }
        return obj;
    }

    init(options?: InitOptions) {
        if (!options) {
            options = {};
        }
        this.log("initialize the bundle otsimo.js")
        if ((this.isWKWebView && !options.isTestApp) || this.android) {
            let params = this.getAllUrlParams();
            if (params['by_url'] === "1" || params['by_url'] === "true") {
                this.__init({
                    child: {
                        firstname: params["firstname"],
                        lastname: params["lastname"],
                        id: params["id"],
                        gameid: params["gameid"],
                        language: params["language"],
                    },
                    capabilities: params['capabilities'],
                    sound: params["sound"] === "true" || params["sound"] === "1",
                    settings: JSON.parse(params["settings"]),
                    root: params["root"] || "",
                    screen: {
                        width: Number(params["width"]),
                        height: Number(params["height"]),
                    }
                });
                return;
            }
            this.log("sandbox won't be initializing")
            return
        }
        this.child = {
            firstname: options.firstname || "debug",
            lastname: options.lastname || "user",
            id: options.childid || "",
            gameid: options.gameid || "",
            language: options.language || this.getLanguages()[0],
        }
        this._width = options.width || 1024;
        this._height = options.height || 768;
        if (options.capabilities && Array.isArray(options.capabilities)) {
            this._capabilities = options.capabilities;
        }
        this._debug = !(options.debug === false);
        this.getJSON("otsimo.json", this.__initManifest.bind(this));
    }

    private getLanguages(): string[] {
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

    private registerAndroidMessages() {
        document.addEventListener('message', (e: any) => {
            try {
                var messageData = JSON.parse(e.data);
                var fn = this[messageData.func];
                if (typeof fn === 'function') {
                    fn.apply(this, messageData.args);
                }
            } catch (err) {
                console.warn(err);
            }
        });
    }
    private __callSettingsCallbacks(settings: any, sound: boolean) {
        if (settings) {
            this.settings = settings;
        }
        this._sound = sound;
        for (let cb of this._settingsCallbacks) {
            cb(settings, sound);
        }
    }

    private __callResolutionCallbacks(width: number, height: number, orientation: string) {
        for (let i = 0; i < this._resoulutionCallbacks.length; i++) {
            this._resoulutionCallbacks[i](width, height, orientation);
        }
        this._width = width;
        this._height = height;
    }

    private __callLoadingCallbacks() {
        this._isLoaded = true;
        for (const cb of this._callbackStack) {
            cb();
        }
        this._callbackStack.splice(0, this._callbackStack.length);
    }

    private __loadKeyValueStore() {
        var sy = this.getLanguages()
        var lang = this.child.language || this.manifest.default_language;
        var langFile = this.manifest.kv_path + "/" + lang + ".json"

        if (sy.length > 0 && !this.child.language) {
            for (var i = 0; i < sy.length; ++i) {
                var nextLang = this.manifest.languages[sy[i].substring(0, 2)];
                if (nextLang) {
                    langFile = this.manifest.kv_path + "/" + nextLang + ".json"
                    break;
                }
            }
        }
        this.getJSON(langFile, (err, data) => {
            if (err) {
                this.log("failed to get kv, status", err)
            } else {
                this.kv = data
                this.log("otsimo initialized");
                this.__callLoadingCallbacks()
            }
        })
    }

    private __initSettings(err?: any, data?: any) {
        if (err) {
            this.log("failed to get settings,status", err)
        } else {
            this.log("settings", data)
            var ks = Object.keys(data.properties)
            for (var i = 0; i < ks.length; ++i) {
                var p = data.properties[ks[i]]
                this.settings[p.id] = p.default
            }
            this.__loadKeyValueStore()
        }
    }

    private __initManifest(err?: any, data?: any) {
        if (err) {
            this.log("Failed to get otsimo.json, status=", err);
        } else {
            this.manifest = data;
            this.getJSON(this.manifest.settings, this.__initSettings.bind(this));
        }
    }

    private __init(options: NativeInitOptions) {
        this.log("__init called", options);
        this.settings = options.settings;
        this.child = options.child;
        this._width = options.screen.width;
        this._height = options.screen.height;
        this._root = options.root || "";
        this._sound = options.sound;
        this._capabilities = options.capabilities || ["sandbox"];
        this.getJSON(this._root + "otsimo.json", (err, manifest) => {
            if (err) {
                return this.log("Failed to get otsimo.json, status=", err);
            }
            this.manifest = manifest;
            let langFile = this._root + this.manifest.kv_path + "/" + this.child.language + ".json";
            this.getJSON(langFile, (err, kv) => {
                if (err) {
                    return this.log("failed to get kv, status", err)
                }
                this.kv = kv;
                this.log("initialized");
                this.__callLoadingCallbacks();
            })
        })
    }

    private getJSON(url, res: (err?: any, data?: any) => void) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4) {
                let status = xmlhttp.status;
                if (status === 200 || status === 0) {
                    try {
                        let data = JSON.parse(xmlhttp.responseText);
                        res(null, data);
                    } catch (err) {
                        res(err);
                    }
                } else {
                    res(status);
                }
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
}

export const otsimo = new OtsimoHelper();
(window as any).otsimo = otsimo;
