import { Otsimo } from './common';

export type InputSource = "camera" | "mic" | "image" | "audio";

export class ML {
    constructor(private otsimo: Otsimo<any, any, any, any>) { }

    loadGraph(filepath: string) {

    }

    predict(input: any, cb: (result: any) => void) {

    }

    predictFromStream(source: InputSource, cb: (result: any) => void) {

    }

    closeStream() {

    }

}