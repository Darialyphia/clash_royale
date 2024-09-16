import { indexToPoint, pointToIndex, Vec2, type Serializable } from '@game/shared';
import { Entity, type EntityId } from '../entity';
import type { GameSession } from '../game-session';

/**
 * The shape of the input used to create a board cell
 */
export type BoardCellBlueprint = {
  /**
   * The position of the cell texture in the spritesheet atlas
   */
  atlasCoords: [number, number];
  /**
   * If true, indicates that this cell should trigger collisions
   */
  solid: boolean;
};

/**
 * The shape of the input used to create a board
 */
export type BoardBlueprint = {
  id: EntityId;
  width: number;
  height: number;
  cells: BoardCellBlueprint[];
};

/**
 * The JSON serializable representation of the game board that is sent to the game session subscrbers
 */
export type SerializedBoard = {
  width: number;
  height: number;
  cells: Array<{ atlasCoords: [number, number] }>;
};

/**
 * the domain representation of a board cell
 * if this grows more complex it might be worth it to make it its own class :bobby:
 */
type BoardCell = {
  position: Vec2;
  atlasCoords: [number, number];
  solid: boolean;
};

export class Board extends Entity implements Serializable<SerializedBoard> {
  private session: GameSession;

  private width: number;

  private height: number;

  private cells: BoardCell[];

  constructor(session: GameSession, blueprint: BoardBlueprint) {
    super(blueprint.id);
    this.session = session;
    this.width = blueprint.width;
    this.height = blueprint.height;
    this.cells = blueprint.cells.map((cell, index) => {
      return {
        position: Vec2.from(indexToPoint(index, this.width)),
        atlasCoords: cell.atlasCoords,
        solid: cell.solid
      };
    });
  }

  getCellAt(x: number, y: number) {
    return this.cells[pointToIndex({ x, y }, this.width)];
  }

  serialize() {
    return {
      width: this.width,
      height: this.height,
      cells: this.cells.map(cell => ({ atlasCoords: cell.atlasCoords }))
    };
  }
}
