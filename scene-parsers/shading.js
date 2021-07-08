import { AssetsService } from '../services/assets-service';
import { VarService } from '../services/var-service';
import { convertMaterialType } from '../utils/materials';

export const parseShading = (object) => {
  const { userData } = object;

  if (userData.shading) {
    VarService.resolveVar(userData.shading, (value) => {
      const replacementMaterial = convertMaterialType(object.material, value);
    
      AssetsService.registerDisposable(object.material);
  
      object.material = replacementMaterial;
    }, (listener) => {
      AssetsService.registerDisposeCallback(object, () => VarService.disposeListener(userData.shading, listener));
    });
  }
};
