import { mapRange } from '@game/shared';
import { Color } from 'excalibur';
import { GameSessionBlueprint } from './entities/game-session';

export const TILE_SIZE = 32;
export const MAP_ROWS = 7;
export const MAP_COLS = 11;
export const WIDTH = TILE_SIZE * MAP_COLS;
export const HEIGHT = TILE_SIZE * MAP_ROWS;

export const UNIT_WIDTH = TILE_SIZE / 2;
export const UNIT_HEIGHT = TILE_SIZE / 2;
export const TOWER_WIDTH = TILE_SIZE;
export const TOWER_HEIGHT = TILE_SIZE;

export const BG_COLOR = Color.fromHSL(mapRange(250, [0, 360], [0, 1]), 0.3, 0.25);

export const OUTER_TOWER_RANGE = TILE_SIZE * 3;
export const OUTER_TOWER_HEALTH = 500;
export const OUTER_TOWER_ATTACK = 10;

export const INNER_TOWER_RANGE = TILE_SIZE * 3;
export const INNER_TOWER_ATTACK = 15;
export const INNER_TOWER_HEALTH = 800;

const GRASS: [number, number] = [0, 0];
const WATER: [number, number] = [1, 0];
const BRIDGE: [number, number] = [2, 0];

export const SESSION_BLUEPRINT: GameSessionBlueprint = {
  // prettier-ignore
  map: [
    GRASS, GRASS, GRASS, GRASS, GRASS, WATER, GRASS, GRASS, GRASS, GRASS, GRASS, 
    GRASS, GRASS, GRASS, GRASS, GRASS, BRIDGE,GRASS, GRASS, GRASS, GRASS, GRASS,
    GRASS, GRASS, GRASS, GRASS, GRASS, WATER, GRASS, GRASS, GRASS, GRASS, GRASS, 
    GRASS, GRASS, GRASS, GRASS, GRASS, WATER, GRASS, GRASS, GRASS, GRASS, GRASS, 
    GRASS, GRASS, GRASS, GRASS, GRASS, WATER, GRASS, GRASS, GRASS, GRASS, GRASS,
    GRASS, GRASS, GRASS, GRASS, GRASS, BRIDGE,GRASS, GRASS, GRASS, GRASS, GRASS, 
    GRASS, GRASS, GRASS, GRASS, GRASS, WATER, GRASS, GRASS, GRASS, GRASS, GRASS,
  ],
  teams: [
    {
      deployZone: { x: 0, y: 0, width: 5, height: MAP_ROWS },
      players: [
        {
          id: 'player1',
          innerTower: { x: 0, y: Math.floor(MAP_ROWS / 2) },
          outerTowers: [
            { x: 1, y: 1 },
            { x: 1, y: MAP_ROWS - 2 }
          ]
        }
      ]
    },
    {
      deployZone: { x: 6, y: 0, width: 5, height: MAP_ROWS },
      players: [
        {
          id: 'player2',
          innerTower: { x: MAP_COLS - 1, y: Math.floor(MAP_ROWS / 2) },
          outerTowers: [
            { x: MAP_COLS - 2, y: 1 },
            { x: MAP_COLS - 2, y: MAP_ROWS - 2 }
          ]
        }
      ]
    }
  ]
};
