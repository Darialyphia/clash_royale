import { TILE_SIZE } from '@/constants';
import { Vector } from 'excalibur';

export class GameCoords {
  coords: Vector;
  constructor(x: number, y: number) {
    this.coords = new Vector(x, y);
  }

  toScreenCoords() {
    console.log(this.coords);
    return this.coords.scale(TILE_SIZE);
  }
}
