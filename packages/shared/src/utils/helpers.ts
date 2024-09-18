import type { Point } from '../types';
import type { AnyObject, Entries } from '../types';

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export const random = (max: number) => Math.random() * max;

export const shuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(random(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const shuffled = <T>(array: T[]): T[] => {
  array = [...array];
  shuffle(array);
  return array;
}

export const randomInt = (max: number) => Math.floor(random(max + 1));

export const indexToPoint = (idx: number, width: number): Point => ({
  x: idx % width,
  y: Math.floor(idx / width)
});

export const pointToIndex = ({ x, y }: Point, width: number) => width * y + x;

type UnionToIntersection<T> = (T extends T ? (p: T) => void : never) extends (
  p: infer U
) => void
  ? U
  : never;
type FromEntries<T extends readonly [PropertyKey, any]> = T extends T
  ? Record<T[0], T[1]>
  : never;
// eslint-disable-next-line @typescript-eslint/ban-types
type Flatten<T> = {} & {
  [P in keyof T]: T[P];
};

export function fromEntries<
  V extends PropertyKey,
  T extends [readonly [V, any]] | Array<readonly [V, any]>
>(entries: T): Flatten<UnionToIntersection<FromEntries<T[number]>>> {
  return Object.fromEntries(entries) as any;
}

export const objectEntries = <T extends AnyObject>(obj: T) =>
  Object.entries(obj) as Entries<T>;

export const objectKeys = <T extends AnyObject>(obj: T) =>
  Object.keys(obj) as unknown as (keyof T)[];

export const padArray = <T>(arr: T[], len: number, fill: T) => {
  return arr.concat(Array(len).fill(fill)).slice(0, len);
};

export const waitFor = (ms: number) => {
  return new Promise<void>(res => {
    setTimeout(res, ms);
  });
};
