

interface SpeechConfiguration {
    shouldReportPartialResults?: boolean
}

interface SpeechRecognitionResult {
}

interface SpeechRecognitionResultCallback {
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
