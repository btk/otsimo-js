import { Otsimo } from './common';

export interface SpeechConfiguration {
    shouldReportPartialResults?: boolean
}

export interface SpeechRecognitionResult {
}

export interface SpeechRecognitionResultCallback {
    (result: SpeechRecognitionResult): void;
}

export class Speech {
    constructor(private otsimo: Otsimo<any, any, any, any>) { }

    authorizationStatus(cb: (status: any) => void) {
    }

    recognize(options: SpeechConfiguration, cb: SpeechRecognitionResultCallback) {
    }

    cancel() {
    }
}
