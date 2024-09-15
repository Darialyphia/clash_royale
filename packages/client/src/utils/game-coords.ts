import { TILE_SIZE } from '@/constants';
import { Vector } from 'excalibur';

export class GameCoords {
  coords: Vector;

  static fromScreenCoords(vec: Vector) {
    const { x, y } = vec.scale(1 / (TILE_SIZE * 2));
    return new GameCoords(x, y);
  }
  constructor(x: number, y: number) {
    this.coords = new Vector(x, y);
  }

  toScreenCoords() {
    return this.coords.scale(TILE_SIZE);
  }
}
