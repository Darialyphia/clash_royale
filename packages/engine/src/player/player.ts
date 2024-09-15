import { type Point } from '@game/shared';
import { GameSession } from '../game-session';
import { Tower } from '../tower/tower';
import { Team } from '../team/team';
import { Entity } from '../entity';
import { config } from '../config';

export type PlayerId = string;

export type PlayerBlueprint = {
  id: PlayerId;
  innerTower: Point;
  outerTowers: Point[];
};

export class Player extends Entity {
  private session: GameSession;

  private team: Team;

  // readonly units: Set<Unit> = new Set();

  readonly towers: Set<Tower> = new Set();

  constructor(session: GameSession, blueprint: PlayerBlueprint, team: Team) {
    super(blueprint.id);
    this.team = team;
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
    return this.session.teams.find(team => !team.equals(this.team))!.players;
  }

  addInnerTower(x: number, y: number) {
    const tower = new Tower({
      position: { x, y },
      blueprint: {
        attack: config.INNER_TOWER_ATTACK,
        health: config.INNER_TOWER_HEALTH,
        range: config.INNER_TOWER_RANGE
      },
      player: this
    });
    this.towers.add(tower);

    return tower;
  }

  addOuterTower(x: number, y: number) {
    const tower = new Tower({
      position: { x, y },
      blueprint: {
        attack: config.OUTER_TOWER_ATTACK,
        health: config.OUTER_TOWER_HEALTH,
        range: config.OUTER_TOWER_RANGE
      },
      player: this
    });
    this.towers.add(tower);

    return tower;
  }

  // deployUnit(x: number, y: number, blueprint: UnitBlueprint) {
  //   const unit = new Unit({
  //     player: this,
  //     position: { x, y },
  //     blueprint
  //   });
  //   this.units.add(unit);

  //   return unit;
  // }
}
