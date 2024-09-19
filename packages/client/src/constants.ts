import { BoardCellBlueprint, GameSessionBlueprint } from '@game/logic';
import { mapRange } from '@game/shared';
import { Color } from 'excalibur';

export const DEBUG = true;
export const SHOW_SPRITES = true;
export const TILE_SIZE = 32;
export const MAP_ROWS = 7;
export const MAP_COLS = 11;
export const WIDTH = TILE_SIZE * MAP_COLS;
export const HEIGHT = TILE_SIZE * MAP_ROWS;

export const BG_COLOR = Color.fromHSL(mapRange(250, [0, 360], [0, 1]), 0.3, 0.25);
export const TEAM_1_DEPLOY_ZONE_COLOR = Color.fromHSL(
  mapRange(140, [0, 360], [0, 1]),
  0.7,
  0.6,
  0.5
);
export const TEAM_2_DEPLOY_ZONE_COLOR = Color.fromHSL(
  mapRange(40, [0, 360], [0, 1]),
  0.7,
  0.6,
  0.5
);
export const OUTER_TOWER_RANGE = 3;
export const OUTER_TOWER_HEALTH = 500;
export const OUTER_TOWER_ATTACK = 10;

export const INNER_TOWER_RANGE = 3;
export const INNER_TOWER_ATTACK = 15;
export const INNER_TOWER_HEALTH = 800;

const GRASS: BoardCellBlueprint = { atlasCoords: [0, 0], solid: false };
const WATER: BoardCellBlueprint = { atlasCoords: [1, 0], solid: true };
const BRIDGE: BoardCellBlueprint = { atlasCoords: [2, 0], solid: false };
const BRIDGE_B: BoardCellBlueprint = { atlasCoords: [3, 0], solid: true };
const PATH_H: BoardCellBlueprint = { atlasCoords: [0, 1], solid: false };
const PATH_V: BoardCellBlueprint = { atlasCoords: [1, 1], solid: false };
const PATH_CORNER_TL: BoardCellBlueprint = { atlasCoords: [2, 1], solid: false };
const PATH_CORNER_TR: BoardCellBlueprint = { atlasCoords: [3, 1], solid: false };
const PATH_CORNER_BL: BoardCellBlueprint = { atlasCoords: [0, 2], solid: false };
const PATH_CORNER_BR: BoardCellBlueprint = { atlasCoords: [1, 2], solid: false };

export const SESSION_BLUEPRINT: GameSessionBlueprint = {
  // prettier-ignore
  board: {
    width: MAP_COLS,
    height: MAP_ROWS,
    cells: [
      GRASS,          GRASS, GRASS,  GRASS,  GRASS,  WATER,    GRASS,  GRASS,  GRASS,  GRASS, GRASS, 
      PATH_CORNER_TL, GRASS, PATH_H, PATH_H, PATH_H, BRIDGE,   PATH_H, PATH_H, PATH_H, GRASS, PATH_CORNER_TR,
      PATH_V,         GRASS, GRASS,  GRASS,  GRASS,  BRIDGE_B, GRASS,  GRASS,  GRASS,  GRASS, PATH_V, 
      GRASS,          GRASS, GRASS,  GRASS,  GRASS,  WATER,    GRASS,  GRASS,  GRASS,  GRASS, GRASS, 
      PATH_V,         GRASS, GRASS,  GRASS,  GRASS,  WATER,    GRASS,  GRASS,  GRASS,  GRASS, PATH_V, 
      PATH_CORNER_BL, GRASS, PATH_H, PATH_H, PATH_H, BRIDGE,   PATH_H, PATH_H, PATH_H, GRASS, PATH_CORNER_BR,
      GRASS,          GRASS, GRASS,  GRASS,  GRASS,  BRIDGE_B, GRASS,  GRASS,  GRASS,  GRASS, GRASS,
    ]
  },
  teams: [
    {
      deployZone: { x: 0, y: 0, width: 5, height: MAP_ROWS },
      players: [
        {
          id: 'player1',
          innerTower: { x: 0.5, y: Math.floor(MAP_ROWS / 2) + 0.5 },
          outerTowers: [
            { x: 1.5, y: 1.5 },
            { x: 1.5, y: MAP_ROWS - 2 + 0.5 }
          ],
          manaSystem: {
            initialValue: 0,
            baseRechargeRate: 0.001,
            maxCapacity: 5,
            id: 'mana1'
          },
          deck: {
            id: 'deck1',
            cards: [
              {
                id: 'card1',
                cost: 1,
                name: 'CARD 1',
                cooldown: 1000,
                targets: ['PlayerBoard']
              },
              {
                id: 'card2',
                cost: 1,
                name: 'CARD 2',
                cooldown: 2000,
                targets: ['PlayerBoard']
              },
              {
                id: 'card3',
                cost: 1,
                name: 'CARD 3',
                cooldown: 3000,
                targets: ['PlayerBoard']
              },
              {
                id: 'card4',
                cost: 1,
                name: 'CARD 4',
                cooldown: 4000,
                targets: ['PlayerBoard']
              },
              {
                id: 'card5',
                cost: 1,
                name: 'CARD 5',
                cooldown: 5000,
                targets: ['PlayerBoard']
              },
              {
                id: 'card6',
                cost: 1,
                name: 'CARD 6',
                cooldown: 6000,
                targets: ['PlayerBoard']
              }
            ]
          }
        }
      ]
    },
    {
      deployZone: { x: 6, y: 0, width: 5, height: MAP_ROWS },
      players: [
        {
          id: 'player2',
          innerTower: { x: MAP_COLS - 1 + 0.5, y: Math.floor(MAP_ROWS / 2) + 0.5 },
          outerTowers: [
            { x: MAP_COLS - 2 + 0.5, y: 1.5 },
            { x: MAP_COLS - 2 + 0.5, y: MAP_ROWS - 2 + 0.5 }
          ],
          manaSystem: {
            initialValue: 0,
            baseRechargeRate: 0.001,
            maxCapacity: 10,
            id: 'mana2'
          },
          deck: {
            id: 'deck2',
            cards: [
              {
                id: 'card1',
                cost: 1,
                name: 'CARD 1',
                cooldown: 1000,
                targets: ['PlayerBoard']
              },
              {
                id: 'card2',
                cost: 1,
                name: 'CARD 2',
                cooldown: 2000,
                targets: ['OpponentBoard']
              },
              {
                id: 'card3',
                cost: 1,
                name: 'CARD 3',
                cooldown: 3000,
                targets: ['PlayerUnit']
              },
              {
                id: 'card4',
                cost: 1,
                name: 'CARD 4',
                cooldown: 4000,
                targets: ['OpponentUnit']
              },
              {
                id: 'card5',
                cost: 1,
                name: 'CARD 5',
                cooldown: 5000,
                targets: ['PlayerTower']
              },
              {
                id: 'card6',
                cost: 1,
                name: 'CARD 6',
                cooldown: 6000,
                targets: ['OpponentTower']
              }
            ]
          }
        }
      ]
    }
  ]
};

export const Z_INDICES = {
  UI: 999
};
