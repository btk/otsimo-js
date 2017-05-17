import { Otsimo } from './common';
export interface CameraOpenOptions {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fullscreen?: boolean;
}
export class Camera {

    constructor(private otsimo: Otsimo<any, any, any, any>) { }

    openCamera(options: CameraOpenOptions) {
    }

    closeCamera() {
    }

    canAccessCamera(cb: (result: boolean) => void) {
        cb(false);
    }
}
