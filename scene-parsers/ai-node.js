import * as Three from 'three';
import { AiService } from '../services/ai-service.js';
import { AnimationService } from '../services/animation-service.js';
import { AssetsService } from "../services/assets-service.js";
import { DebugFlags, DummyDebug } from '../services/dummy-debug.js';
import { removePlaceholder } from '../utils/remove-placeholder.js';
import { isDefined } from '../utils/shared.js';

export const parseAiNode = (object) => {
  const { userData } = object;

  if (isDefined(userData.aiNode)) {
    if (!DummyDebug.get(DebugFlags.DEBUG_AI_NODES)) {
      removePlaceholder(object);

      object.visible = false;
    } else {
      AssetsService.disposeAsset(object.material);

      object.material = new Three.MeshNormalMaterial();

      AssetsService.registerDisposable(object.material);

      AnimationService.registerAnimation({
        target: object,
        onCreate: ({ target }) => {
          target.userData.originalLevel = target.position.y;
        },
        onStep: ({ target, animationTime }) => {
          target.rotation.y += 0.01;
          target.rotation.x += 0.01;
          target.rotation.z += 0.01;

          target.position.y = target.userData.originalLevel + Math.sin(animationTime);
        },
        onDispose: ({ target }) => {
          delete target.userData.originalLevel;
        }
      });
    }

    AiService.registerAiNode(object);
    AssetsService.registerDisposeCallback(object, () => AiService.disposeAiNode(object));
  }
};
