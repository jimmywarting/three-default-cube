import { AiService } from "../services/ai-service.js";
import { AnimationService } from "../services/animation-service.js";
import { AssetsService } from "../services/assets-service.js";
import { AudioService } from "../services/audio-service.js";
import { CameraService } from "../services/camera-service.js";
import { InteractionsService } from "../services/interactions-service.js";
import { MathService } from "../services/math-service.js";
import { ParticleService } from "../services/particle-service.js";
import { PhysicsService } from "../services/physics-service.js";
import { RenderService } from "../services/render-service.js";
import { SceneService } from "../services/scene-service.js";
import { TimeService } from "../services/time-service.js";
import { UiService } from "../services/ui-service.js";
import { UtilsService } from "../services/utils-service.js";
import { VarService } from "../services/var-service.js";

export class ViewClass {
  onCreate() {}
  onDispose() {}

  dispose() {
    const scene = RenderService.getScene();

    scene.children.forEach(child => {
      AssetsService.registerDisposable(child);
    });

    this.onDispose();

    RenderService.resetPostProcessing();
    AiService.disposeAll();
    PhysicsService.disposeAll();
    CameraService.disposeAll();
    TimeService.disposeAll();
    AnimationService.disposeAll();
    InteractionsService.disposeListeners();
    VarService.disposeListeners();
    SceneService.disposeAll();
    UiService.disposeAll();
    ParticleService.disposeAll();
    AudioService.resetAudio();
    UtilsService.disposeAll();
    AssetsService.disposeAll();

    MathService.handleLeaks();
  }
}
