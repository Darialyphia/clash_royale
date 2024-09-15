import type { Point, Serializable } from '../types';

export class Vec2 implements Serializable {
  static from(pt: Point) {
    return new Vec2(pt.x, pt.y);
  }

  static add(vec1: Point, vec2: Point) {
    return Vec2.from(vec1).add(vec2);
  }

  static sub(vec1: Point, vec2: Point) {
    return Vec2.from(vec1).sub(vec2);
  }

  static scale(vec1: Point, vec2: Point) {
    return Vec2.from(vec1).mul(vec2);
  }

  static div(vec1: Point, vec2: Point) {
    return Vec2.from(vec1).div(vec2);
  }

  constructor(
    public x: number,
    public y: number
  ) {}

  serialize() {
    return { x: this.x, y: this.y };
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  equals(vec: Point) {
    return this.x === vec.x && this.y === vec.y;
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    return this;
  }

  add({ x, y }: Point) {
    this.x += x;
    this.y += y;

    return this;
  }

  sub({ x, y }: Point) {
    this.x -= x;
    this.y -= y;

    return this;
  }

  mul({ x, y }: Point) {
    this.x *= x;
    this.y *= y;

    return this;
  }
  div({ x, y }: Point) {
    this.x /= x;
    this.y /= y;

    return this;
  }

  dist({ x, y }: Point) {
    const diff = {
      x: x - this.x,
      y: y - this.y
    };

    return Math.sqrt(diff.x ** 2 + diff.y ** 2);
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }
}
