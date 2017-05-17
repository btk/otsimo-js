export interface Child {
    firstname: string;
    lastname: string;
    id: string;
    gameid: string;
    language: string;
}


export interface GameManifest {
    unique_name: string;
    kv_path: string;
    settings: string;
    languages: string[];
    default_language: string;
}

export interface InitOptions {
    firstname?: string
    lastname?: string
    childid?: string;
    gameid?: string;
    language?: string;
    width?: number;
    height?: number;
    capabilities?: string[];
    debug?: boolean;
    isTestApp?: boolean;
}

export interface SettingsCallback {
    (setting: any, sound: boolean): void;
}

export interface ResoulutionCallback {
    (width: number, height: number, orientation: string): void;
}

export interface Otsimo<M, T, C, S> {
    settings: Object;
    kv: any;
    child: Child;
    manifest: GameManifest;
    readonly width: number;
    readonly height: number;
    readonly isWKWebView: boolean;
    readonly iOS: boolean;
    readonly android: boolean;
    readonly capabilities: string[];

    readonly ml: M;
    readonly tts: T;
    readonly camera: C;
    readonly speech: S;

    log(message?: any, ...optionalParams: any[]): void;
    customevent(eventName: string, data?: Object): void;
    quitgame(): void;
    run(cb: () => void): void;
    onSettingsChanged(cb: SettingsCallback): void;
    onResolutionChanged(cb: ResoulutionCallback): void;
    init(options?: InitOptions): void;
}
