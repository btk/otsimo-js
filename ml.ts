
type InputSource = "camera" | "mic" | "image" | "audio";

export class ML {
    loadGraph(filepath: string) {

    }

    predict(input: any, cb: (result: any) => void) {

    }

    predictFromStream(source: InputSource, cb: (result: any) => void) {

    }

    closeStream() {

    }

}