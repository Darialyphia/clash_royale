import { TILE_SIZE } from '@/constants';
import { Point } from '@game/shared';
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

export const toScreen = (val: number) => val * TILE_SIZE;
export const toScreenVector = (vec: Point) => new Vector(vec.x, vec.y).scale(TILE_SIZE);
export const toWorld = (val: number) => val / TILE_SIZE;
export const toWorldVector = (vec: Point) =>
  new Vector(vec.x, vec.y).scale(1 / TILE_SIZE);
