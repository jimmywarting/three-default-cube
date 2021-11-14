import { removePlaceholder } from "../utils/remove-placeholder.js";
import { isDefined } from "../utils/shared.js";

export const parseAiSpawn = (object, { aiSpawns }) => {
  const { userData } = object;

  if (isDefined(userData.aiSpawn)) {
    removePlaceholder(object);

    object.visible = false;

    aiSpawns.push(object);
  }
};
