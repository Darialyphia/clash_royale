import { mapRange } from '@game/shared';
import { Color } from 'excalibur';
import { GameSessionBlueprint } from './entities/game-session';

export const DEBUG = true;
export const TILE_SIZE = 32;
export const MAP_ROWS = 7;
export const MAP_COLS = 11;
export const WIDTH = TILE_SIZE * MAP_COLS;
export const HEIGHT = TILE_SIZE * MAP_ROWS;

export const UNIT_WIDTH = 0.5;
export const UNIT_HEIGHT = 0.5;
export const TOWER_WIDTH = 1;
export const TOWER_HEIGHT = 1;

export const BG_COLOR = Color.fromHSL(mapRange(250, [0, 360], [0, 1]), 0.3, 0.25);
export const TEAM_1_DEPLOY_ZONE_COLOR = Color.fromHSL(
  mapRange(140, [0, 360], [0, 1]),
  0.7,
  0.6,
  1
);
export const TEAM_2_DEPLOY_ZONE_COLOR = Color.fromHSL(
  mapRange(40, [0, 360], [0, 1]),
  0.7,
  0.6,
  1
);
export const OUTER_TOWER_RANGE = TILE_SIZE * 3;
export const OUTER_TOWER_HEALTH = 500;
export const OUTER_TOWER_ATTACK = 10;

export const INNER_TOWER_RANGE = TILE_SIZE * 3;
export const INNER_TOWER_ATTACK = 15;
export const INNER_TOWER_HEALTH = 800;

type AtlasCoord = [number, number];
const GRASS: AtlasCoord = [0, 0];
const WATER: AtlasCoord = [1, 0];
const BRIDGE: AtlasCoord = [2, 0];
const BRIDGE_B: AtlasCoord = [3, 0];
const PATH_H: AtlasCoord = [0, 1];
const PATH_V: AtlasCoord = [1, 1];
const PATH_CORNER_TL: AtlasCoord = [2, 1];
const PATH_CORNER_TR: AtlasCoord = [3, 1];
const PATH_CORNER_BL: AtlasCoord = [0, 2];
const PATH_CORNER_BR: AtlasCoord = [1, 2];

export const SESSION_BLUEPRINT: GameSessionBlueprint = {
  // prettier-ignore
  map: [
    GRASS,          GRASS, GRASS,  GRASS,  GRASS,  WATER,    GRASS,  GRASS,  GRASS,  GRASS, GRASS, 
    PATH_CORNER_TL, GRASS, PATH_H, PATH_H, PATH_H, BRIDGE,   PATH_H, PATH_H, PATH_H, GRASS, PATH_CORNER_TR,
    PATH_V,         GRASS, GRASS,  GRASS,  GRASS,  BRIDGE_B, GRASS,  GRASS,  GRASS,  GRASS, PATH_V, 
    GRASS,          GRASS, GRASS,  GRASS,  GRASS,  WATER,    GRASS,  GRASS,  GRASS,  GRASS, GRASS, 
    PATH_V,         GRASS, GRASS,  GRASS,  GRASS,  WATER,    GRASS,  GRASS,  GRASS,  GRASS, PATH_V, 
    PATH_CORNER_BL, GRASS, PATH_H, PATH_H, PATH_H, BRIDGE,   PATH_H, PATH_H, PATH_H, GRASS, PATH_CORNER_BR,
    GRASS,          GRASS, GRASS,  GRASS,  GRASS,  BRIDGE_B, GRASS,  GRASS,  GRASS,  GRASS, GRASS,
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
