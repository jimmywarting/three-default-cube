import { AssetsService } from "../services/assets-service.js";
import { VarService } from "../services/var-service.js";
import { isDefined } from "../utils/shared.js";

export const parseIfNot = (object) => {
  const { userData } = object;

  if (isDefined(userData.ifNot)) {
    VarService.resolveVar(userData.ifNot, (newValue) => {
      if (!object || !object.parent) {
        return false;
      }

      object.visible = !newValue;
    }, (listener) => {
      AssetsService.registerDisposeCallback(object, () => VarService.disposeListener(userData.ifNot, listener));
    });
  }
};
