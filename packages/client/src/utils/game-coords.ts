import { TILE_SIZE } from '@/constants';
import { Vector } from 'excalibur';

export class GameCoords {
  coords: Vector;

  static fromScreenCoords(vec: Vector) {
    return new GameCoords(vec.x / TILE_SIZE, vec.y / TILE_SIZE);
  }
  constructor(x: number, y: number) {
    this.coords = new Vector(x, y);
  }

  toScreenCoords() {
    return this.coords.scale(TILE_SIZE);
  }
}
