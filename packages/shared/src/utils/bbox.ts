import type { Circle, Point, Rectangle, Serializable } from '../types';
import { Vec2 } from './vector';

export class Bbox implements Serializable<Rectangle> {
  static from(rect: Rectangle) {
    return new Bbox(
      { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
      rect.width,
      rect.height
    );
  }

  width: number;

  height: number;

  private center: Vec2;

  constructor(center: Point, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.center = Vec2.from(center);
  }

  serialize() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  get x() {
    return this.center.x;
  }

  set x(val: number) {
    this.center.x = val;
  }

  get y() {
    return this.center.y;
  }

  set y(val: number) {
    this.center.y = val;
  }

  get xmin() {
    return this.center.x - this.width / 2;
  }

  get xmax() {
    return this.center.x + this.width / 2;
  }

  get ymin() {
    return this.center.y - this.height / 2;
  }

  get ymax() {
    return this.center.y + this.height / 2;
  }

  get topLeft() {
    return new Vec2(this.xmin, this.ymin);
  }

  get topRight() {
    return new Vec2(this.xmin, this.ymax);
  }

  get bottomLeft() {
    return new Vec2(this.xmax, this.ymin);
  }

  get bottomRight() {
    return new Vec2(this.xmax, this.ymax);
  }

  collidesWith(other: Bbox): boolean {
    return !(
      this.xmax < other.xmin ||
      this.xmin > other.xmax ||
      this.ymax < other.ymin ||
      this.ymin > other.ymax
    );
  }

  intersectsPoint(point: Point): boolean {
    return (
      point.x >= this.xmin &&
      point.x <= this.xmax &&
      point.y >= this.ymin &&
      point.y <= this.ymax
    );
  }

  intersectsCircle(circle: Circle): boolean {
    const closest = new Vec2(
      Math.max(this.xmin, Math.min(circle.x, this.xmax)),
      Math.max(this.ymin, Math.min(circle.y, this.ymax))
    );

    const distance = closest.dist(circle);

    return distance <= circle.radius;
  }
}
