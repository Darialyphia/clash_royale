import { Point } from '@game/shared';
import { GameSession } from '../game-session';
import { Tower } from '../tower/tower';
import { Unit } from '../unit/unit.entity';
import {
  INNER_TOWER_ATTACK,
  INNER_TOWER_HEALTH,
  INNER_TOWER_RANGE,
  OUTER_TOWER_ATTACK,
  OUTER_TOWER_HEALTH,
  OUTER_TOWER_RANGE
} from '@/constants';
import { GameCoords } from '@/utils/game-coords';
import { Entity } from '../_entity';

export type PlayerId = string;

export type PlayerBlueprint = {
  id: PlayerId;
  innerTower: Point;
  outerTowers: Point[];
};

export class Player extends Entity {
  private session: GameSession;

  readonly units: Unit[] = [];

  readonly towers: Tower[] = [];

  constructor(session: GameSession, blueprint: PlayerBlueprint) {
    super(blueprint.id);
    this.session = session;
    this.addInnerTower(blueprint.innerTower.x, blueprint.innerTower.y);
    blueprint.outerTowers.forEach(({ x, y }) => {
      this.addOuterTower(x, y);
    });
  }

  equals(player: Player) {
    return this.id === player.id;
  }

  get opponents() {
    return this.session.teams.find(team => !team.equals(this))!.players;
  }

  addInnerTower(x: number, y: number) {
    const tower = new Tower({
      position: new GameCoords(x, y),
      blueprint: {
        attack: INNER_TOWER_ATTACK,
        health: INNER_TOWER_HEALTH,
        range: INNER_TOWER_RANGE
      },
      player: this
    });
    this.towers.push(tower);

    return tower;
  }

  addOuterTower(x: number, y: number) {
    const tower = new Tower({
      position: new GameCoords(x, y),
      blueprint: {
        attack: OUTER_TOWER_ATTACK,
        health: OUTER_TOWER_HEALTH,
        range: OUTER_TOWER_RANGE
      },
      player: this
    });
    this.towers.push(tower);

    return tower;
  }
}
