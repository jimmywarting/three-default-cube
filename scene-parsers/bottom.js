import { AssetsService } from '../services/assets-service.js';
import { MathService } from "../services/math-service.js";
import { RenderService } from '../services/render-service.js';
import { TimeService } from "../services/time-service.js";
import { VarService } from '../services/var-service.js';
import { get3dScreenHeight } from "../utils/screen-size.js";
import { UiService } from '../services/ui-service.js';
import { isDefined } from '../utils/shared.js';

export const parseBottom = (object) => {
  const { userData } = object;

  if (isDefined(userData.bottom)) {
    if (!UiService.isUiElement(object)) {
      console.info('parseBottom', 'object must be part of the UI layer');

      return;
    }

    let frameListener = null;

    VarService.resolveVar(
      userData.bottom,
      (value) => {
        if (frameListener) {
          TimeService.disposeFrameListener(frameListener);
        }

        if (!value) {
          return;
        }

        const percentageOffset = value.substr(-1) === '%';
        const offset = parseFloat(value);

        if (isNaN(offset)) {
          console.info('parseBottom', 'NaN value');

          return;
        }

        frameListener = TimeService.registerFrameListener(() => {
          if (!object.visible) {
            return;
          }

          const camera = RenderService.getNativeCamera();
          const position = MathService.getVec3(0.0, 0.0, 0.0);
          const cameraPosition = MathService.getVec3(0.0, 0.0, 0.0);
          const cameraDirection = MathService.getVec3(0.0, 0.0, 0.0);

          object.getWorldPosition(position);
          camera.getWorldPosition(cameraPosition);
          camera.getWorldDirection(cameraDirection);

          const cameraOffset = position.sub(cameraPosition).projectOnVector(cameraDirection).length();
          const screenHeight = get3dScreenHeight(cameraOffset, camera);

          object.position.y = -screenHeight / 2.0;

          if (percentageOffset) {
            object.position.y += (offset / 100.0) * screenHeight;
          } else {
            object.position.y += offset;
          }

          MathService.releaseVec3(position);
          MathService.releaseVec3(cameraPosition);
          MathService.releaseVec3(cameraDirection);
        });

        AssetsService.registerDisposeCallback(object, () => TimeService.disposeFrameListener(frameListener));
      }
    );
  }
};
