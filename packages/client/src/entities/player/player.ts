import { Point } from '@game/shared';
import { GameSession } from '../game-session';
import { Tower } from '../tower/tower';
import { Unit, UnitBlueprint } from '../unit/unit.entity';
import {
  INNER_TOWER_ATTACK,
  INNER_TOWER_HEALTH,
  INNER_TOWER_RANGE,
  OUTER_TOWER_ATTACK,
  OUTER_TOWER_HEALTH,
  OUTER_TOWER_RANGE,
} from '@/constants';
import { GameCoords } from '@/utils/game-coords';
import { Entity } from '../_entity';
import { Team } from '../team/team';
import { ManaSystem, ManaSystemActor, ManaSystemBlueprint } from '@/entities/mana/mana-system.ts';
import { Actor, Engine } from 'excalibur';

export type PlayerId = string;

export type PlayerBlueprint = {
  id: PlayerId;
  innerTower: Point;
  outerTowers: Point[];
  manaSystem: ManaSystemBlueprint;
};

export class PlayerActor extends Actor {
  public readonly player: Player;

  constructor(blueprint: { player: Player, location: "left" | "right" }) {
    super({
      x: 0,
      y: 0,
      visible: false,
    })
    this.player = blueprint.player;
    this.addChild(new ManaSystemActor({mana: this.player.manaSystem, location: blueprint.location}))
  }

  onPreUpdate(engine: Engine, delta: number) {
    this.player.tick(delta)
    super.onPreUpdate(engine, delta);
  }
}

export class Player extends Entity {
  private session: GameSession;

  private team: Team;

  readonly units: Set<Unit> = new Set();

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

  get opponents() {
    return this.session.teams.find(team => !team.equals(this.team))!.players;
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
    this.towers.add(tower);

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
    this.towers.add(tower);

    return tower;
  }

  deployUnit(x: number, y: number, blueprint: UnitBlueprint) {
    const unit = new Unit({
      player: this,
      position: { x, y },
      blueprint
    });
    this.units.add(unit);

    return unit;
  }
}
