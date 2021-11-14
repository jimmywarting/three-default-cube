import { AssetsService } from "../services/assets-service.js";
import { isDefined } from "../utils/shared.js";

export const parseCacheMaterial = (object) => {
  const { userData } = object;

  if (isDefined(userData.cacheMaterial)) {
    AssetsService.saveMaterial(object.material);

    object.userData.cachedMaterialId = object.material.name;
  }
};
