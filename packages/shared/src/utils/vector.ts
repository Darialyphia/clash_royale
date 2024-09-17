import type { Point, Radians, Serializable } from '../types';

export class Vec2 implements Serializable {
  static from(pt: Point) {
    return new Vec2(pt.x, pt.y);
  }

  static fromAngle(angle: Radians) {
    return new Vec2(Math.cos(angle), Math.sin(angle));
  }

  static get Zero() {
    return new Vec2(0, 0);
  }

  static add(vec1: Point, vec2: Point) {
    return Vec2.from(vec1).add(vec2);
  }

  static sub(vec1: Point, vec2: Point) {
    return Vec2.from(vec1).sub(vec2);
  }

  static scale(vec1: Point, vec2: Point) {
    return Vec2.from(vec1).scale(vec2);
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

  scale({ x, y }: Point) {
    this.x *= x;
    this.y *= y;

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

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const magnitude = this.magnitude();
    if (magnitude === 0) {
      return Vec2.Zero;
    }

    return new Vec2(this.x / magnitude, this.y / magnitude);
  }
}
