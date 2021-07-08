import { AssetsService } from "../services/assets-service";

export const removePlaceholder = (target) => {
  if (target.geometry) {
    AssetsService.disposeProps(target.geometry);
  }

  if (target.material) {
    AssetsService.disposeProps(target.material);
  }

  if (target.children) {
    target.children.forEach(child => target.remove(child));
  }

  delete target.geometry;
  delete target.material;

  target.isGroup = true; // NOTE Very nasty hack
  target.isMesh = false;
};
