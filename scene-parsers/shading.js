import { AssetsService } from '../services/assets-service.js';
import { VarService } from '../services/var-service.js';
import { convertMaterialType } from '../utils/materials.js';
import { isDefined } from '../utils/shared.js';

export const parseShading = (object) => {
  const { userData } = object;

  if (isDefined(userData.shading)) {
    VarService.resolveVar(userData.shading, (value) => {
      const replacementMaterial = convertMaterialType(object.material, value);
    
      AssetsService.registerDisposable(object.material);
  
      object.material = replacementMaterial;
    }, (listener) => {
      AssetsService.registerDisposeCallback(object, () => VarService.disposeListener(userData.shading, listener));
    });
  }
};
