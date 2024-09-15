import type { BBox, Circle, Line, Rectangle } from '../types';
import { Vec2 } from './vector';

export const rectToBBox = (rect: Rectangle): BBox => ({
  ...rect,
  minX: rect.x - rect.width / 2,
  maxX: rect.x + rect.width / 2,
  minY: rect.y - rect.height / 2,
  maxY: rect.y + rect.height / 2
});

export const getRectangleLines = (
  rect: Rectangle
): { top: Line; bottom: Line; left: Line; right: Line } => {
  const bbox = rectToBBox(rect);

  return {
    top: {
      start: new Vec2(bbox.minX, bbox.minY),
      end: new Vec2(bbox.maxX, bbox.minY)
    },
    bottom: {
      start: new Vec2(bbox.minX, bbox.maxY),
      end: new Vec2(bbox.maxX, bbox.maxY)
    },
    left: {
      start: new Vec2(bbox.minX, bbox.minY),
      end: new Vec2(bbox.minX, bbox.maxY)
    },
    right: {
      start: new Vec2(bbox.maxX, bbox.minY),
      end: new Vec2(bbox.maxX, bbox.maxY)
    }
  };
};

export const circleContains = function (circle: Circle, x: number, y: number) {
  const isWithinBounds =
    circle.radius > 0 &&
    x >= circle.x - circle.radius &&
    x <= circle.x + circle.radius &&
    y >= circle.y - circle.radius &&
    y <= circle.y + circle.radius;

  if (!isWithinBounds) return false;

  const dx = (circle.x - x) * (circle.x - x);
  const dy = (circle.y - y) * (circle.y - y);

  return dx + dy <= circle.radius * circle.radius;
};
