import { type Point, type Serializable, Vec2 } from '@game/shared';
import { GameSession } from '../game-session';
import { Tower } from '../tower/tower';
import { Team } from '../team/team';
import { Entity } from '../entity';
import { config } from '../config';
import { ManaSystem, type ManaSystemBlueprint } from '../mana/mana-system';

export type PlayerId = string;

export type PlayerBlueprint = {
  id: PlayerId;
  innerTower: Point;
  outerTowers: Point[];
  manaSystem: ManaSystemBlueprint;
};

export class Player extends Entity implements Serializable {
  private session: GameSession;

  private team: Team;

  // readonly units: Set<Unit> = new Set();

  readonly towers: Set<Tower> = new Set();

  readonly manaSystem: ManaSystem;

  constructor(session: GameSession, blueprint: PlayerBlueprint, team: Team) {
    super(blueprint.id);
    this.team = team;
    this.session = session;
    this.addInnerTower(blueprint.innerTower.x, blueprint.innerTower.y);
    blueprint.outerTowers.forEach(({ x, y }) => {
      this.addOuterTower(x, y);
    });
    this.manaSystem = new ManaSystem(blueprint.manaSystem);
  }

  tick(delta: number) {
    this.manaSystem.tick(delta);
  }

  equals(player: Player) {
    return this.id === player.id;
  }

  opponents() {
    return this.session.teams.find(team => !team.equals(this.team))!.players;
  }

  addInnerTower(x: number, y: number) {
    const tower = new Tower({
      position: Vec2.from({ x, y }),
      blueprint: {
        id: this.id + '_ti',
        attack: config.INNER_TOWER_ATTACK,
        health: config.INNER_TOWER_HEALTH,
        attackRange: config.INNER_TOWER_RANGE
      },
      player: this
    });
    this.towers.add(tower);

    return tower;
  }

  addOuterTower(x: number, y: number) {
    const tower = new Tower({
      position: Vec2.from({ x, y }),
      blueprint: {
        id: this.id + `_to_${this.towers.size + 1}`,
        attack: config.OUTER_TOWER_ATTACK,
        health: config.OUTER_TOWER_HEALTH,
        attackRange: config.OUTER_TOWER_RANGE
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

  serialize() {
    return {};
  }
}
