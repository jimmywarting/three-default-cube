import { AssetsService } from "../services/assets-service.js";
import { PhysicsService } from "../services/physics-service.js";
import { isDefined } from "../utils/shared.js";

export const parseSurface = (object) => {
  const { userData } = object;

  if (isDefined(userData.surface)) {
    PhysicsService.registerSurface(object);

    AssetsService.registerDisposeCallback(object, () => PhysicsService.disposeSurface(object));
  }
};
