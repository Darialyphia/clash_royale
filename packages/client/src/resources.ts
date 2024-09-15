import { ImageSource, Loader, SpriteSheet } from 'excalibur';
import { BG_COLOR } from './constants';
import { AsepriteResource } from '@excaliburjs/plugin-aseprite';

import mapSheetPath from './assets/tilemap.png?url';
import towerSheetPath from './assets/tower.aseprite?url';

export const resources = {
  mapSheet: new ImageSource(mapSheetPath),
  towersheet: new AsepriteResource(towerSheetPath)
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

for (let res of Object.values(resources)) {
  loader.addResource(res);
}
