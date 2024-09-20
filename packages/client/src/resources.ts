import { ImageSource, Loader, SpriteSheet } from 'excalibur';
import { BG_COLOR } from './constants';
import { AsepriteResource } from '@excaliburjs/plugin-aseprite';

import mapSheetPath from './assets/tilemap.png?url';
import towerSheetPath from './assets/tower.aseprite?url';
import towerHealthBarPath from './assets/tower_health_bar.aseprite?url';
import unitHealthBarPath from './assets/unit_health_bar.aseprite?url';
import heartPath from './assets/heart.aseprite?url';
import handPath from './assets/hand.aseprite?url';
import knightPath from './assets/knight.aseprite?url';
import knightCardPath from './assets/knight_card.aseprite?url';

export const resources = {
  mapSheet: new ImageSource(mapSheetPath),
  towerSheet: new AsepriteResource(towerSheetPath),
  towerHealthBarSheet: new AsepriteResource(towerHealthBarPath),
  unitHealthBarSheet: new AsepriteResource(unitHealthBarPath),
  heartSheet: new AsepriteResource(heartPath),
  handSheet: new AsepriteResource(handPath),
  knightSheet: new AsepriteResource(knightPath),
  knightCardSheet: new AsepriteResource(knightCardPath)
} as const;

export const loader = new Loader();
loader.backgroundColor = BG_COLOR.toString();

export const mapSheet = SpriteSheet.fromImageSource({
  image: resources.mapSheet,
  grid: {
    rows: 4,
    columns: 4,
    spriteWidth: 32,
    spriteHeight: 32
  }
});

for (const res of Object.values(resources)) {
  loader.addResource(res);
}
