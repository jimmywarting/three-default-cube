import { GameInfoService } from "../services/game-info-service.js";
import { isDefined } from "../utils/shared.js";

export const parseAnimation = (object) => {
  const { userData } = object;

  if (isDefined(userData.animation)) {
    const animation = GameInfoService.config.animations[userData.animation];

    if (animation) {
      animation(object);
    } else {
      console.warn('parseAnimation', `animation does not exist`, userData.animation);
    }
  }
};
