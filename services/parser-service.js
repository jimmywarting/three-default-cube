// NOTE See DOCS.md for userData declarations

import { parseCamera } from '../scene-parsers/camera.js';
import { parseAction } from '../scene-parsers/action.js';
import { parseLabel } from '../scene-parsers/label.js';
import { parseScroll } from '../scene-parsers/scroll.js';
import { parseIf } from '../scene-parsers/if.js';
import { parseIfNot } from '../scene-parsers/if-not.js';
import { parseRotateXYZ } from '../scene-parsers/rotate-xyz.js';
import { parseMaterial } from '../scene-parsers/material.js';
import { parseAnimation } from '../scene-parsers/animation.js';
import { parseCacheMaterial } from '../scene-parsers/cache-material.js';
import { parseFullscreen } from '../scene-parsers/fullscreen.js';
import { parseGameObject, registerGameObject } from '../scene-parsers/game-object.js';
import { parseAiNode } from '../scene-parsers/ai-node.js';
import { parseAiSpawn } from '../scene-parsers/ai-spawn.js';
import { parseShader } from '../scene-parsers/shader.js';
import { parseNavmap } from '../scene-parsers/navmap.js';
import { parseAlign } from '../scene-parsers/align.js';
import { parseSlideshow } from '../scene-parsers/slideshow.js';
import { parseSurface } from '../scene-parsers/surface.js';
import { parseShading } from '../scene-parsers/shading.js';
import { RenderService } from './render-service.js';
import { parseLeft } from '../scene-parsers/left.js';
import { parseRight } from '../scene-parsers/right.js';
import { parseTop } from '../scene-parsers/top.js';
import { parseBottom } from '../scene-parsers/bottom.js';

class ParserServiceClass {
  parseModel({
    target,
    navpath,
    actions,
    gameObjects,
    onCreate
  }) {
    const garbageCollector = [];
    const children = [];
    const scrollLists = {};
    const gameObjectRefs = {};
    const aiNodes = [];
    const aiSpawns = [];

    const parserPayload = {
      scene: target,
      scrollLists,
      actions: actions || {},
      gameObjects: gameObjects || {},
      gameObjectRefs: gameObjectRefs,
      aiNodes: aiNodes,
      aiSpawns: aiSpawns,
      children: children,
    };

    target.traverse(child => {
      if (navpath && child.userData && typeof child.userData.navpath !== 'undefined' && child.userData.navpath !== navpath) {
        garbageCollector.push(child);

        return;
      }

      children.push(child);
    });

    garbageCollector.forEach(child => {
      child.parent.remove(child);
    });

    // NOTE Parsers caching and registering scene objects
    children.forEach(child => {
      registerGameObject(child, parserPayload);

      parseCamera(child, parserPayload);
      parseAction(child, parserPayload);
      parseScroll(child, parserPayload);
      parseCacheMaterial(child, parserPayload);
      parseAiNode(child, parserPayload);
      parseAiSpawn(child, parserPayload);
      parseNavmap(child, parserPayload);
      parseSurface(child, parserPayload);
    });

    // NOTE Parsers potentially consuming scene objects
    children.forEach(child => {
      parseShader(child, parserPayload);
      parseAnimation(child, parserPayload);
      parseGameObject(child, parserPayload);
      parseLabel(child, parserPayload);
      parseIf(child, parserPayload);
      parseIfNot(child, parserPayload);
      parseMaterial(child, parserPayload);
      parseShading(child, parserPayload);
      parseAlign(child, parserPayload);
      parseLeft(child, parserPayload);
      parseRight(child, parserPayload);
      parseTop(child, parserPayload);
      parseBottom(child, parserPayload);
      parseSlideshow(child, parserPayload);
      parseRotateXYZ(child, parserPayload);
      parseFullscreen(child, parserPayload);
    });
  
    Object.keys(scrollLists).forEach(key => {
      delete scrollLists[key];
    });
  
    if (onCreate) {
      onCreate(parserPayload);
    }

    RenderService.getRenderer().compile(RenderService.getScene(), RenderService.getNativeCamera());
  }
}

export const ParserService = new ParserServiceClass();