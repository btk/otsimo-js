
interface CameraOpenOptions {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fullscreen?: boolean;
}
export class Camera {
    openCamera(options: CameraOpenOptions) {

    }

    closeCamera() {

    }

    canAccessCamera(cb: (result: boolean) => void) {

    }
}
