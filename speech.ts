export interface SpeechConfiguration {
    shouldReportPartialResults?: boolean
}

export interface SpeechRecognitionResult {
}

export interface SpeechRecognitionResultCallback {
    (result: SpeechRecognitionResult): void;
}

export class Speech {
    authorizationStatus(cb: (status: any) => void) {
    }

    recognize(options: SpeechConfiguration, cb: SpeechRecognitionResultCallback) {
    }

    cancel() {
    }
}
