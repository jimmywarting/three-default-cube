import { AssetsService } from "../services/assets-service.js";
import { CameraService } from "../services/camera-service.js";
import { isDefined } from "../utils/shared.js";

export const parseCamera = (object) => {
  const { userData } = object;

  if (isDefined(userData.camera)) {
    object.visible = false;

    CameraService.addCamera(userData.camera, object);

    AssetsService.registerDisposeCallback(object, () => CameraService.disposeCamera(userData.camera));
  }
};
