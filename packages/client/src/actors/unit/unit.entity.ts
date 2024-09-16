import { Point, Values } from '@game/shared';
import { Actor, Circle, Color, Engine, Vector } from 'excalibur';
import { UnitSpawningState } from './states/spawning-state';
import { UnitMovingState } from './states/moving-state';
import { UnitAttackingState } from './states/attacking-state';
import StateMachineBuilder, { StateMachine } from '@/utils/state-machine';
import { Player } from '../player/player';
import { DEBUG, TILE_SIZE } from '@/constants';
import { GameCoords } from '@/utils/game-coords';

export type UnitBlueprint = {
  speed: number;
  attack: number;
  range: number;
  health: number;
  spawnTime: number;
  size: { width: number; height: number };
};

const UNIT_STATES = {
  SPAWNING: 'spawning',
  MOVING: 'moving',
  ATTACKING: 'attacking'
} as const;

export type UnitState = Values<typeof UNIT_STATES>;

export class Unit extends Actor {
  private stateMachine: StateMachine<Unit, UnitState>;

  private readonly blueprint: UnitBlueprint;

  private readonly player: Player;

  health: number;

  constructor({
    position,
    blueprint,
    player
  }: {
    position: Point;
    blueprint: UnitBlueprint;
    player: Player;
  }) {
    const screenCoords = new GameCoords(position.x, position.y).toScreenCoords();
    console.log(position);
    super({
      x: screenCoords.x,
      y: screenCoords.y,
      width: blueprint.size.width * TILE_SIZE,
      height: blueprint.size.height * TILE_SIZE,
      color: Color.Blue,
      anchor: new Vector(0, 0)
    });

    this.player = player;
    this.blueprint = blueprint;
    this.health = this.blueprint.health;
    this.stateMachine = new StateMachineBuilder<Unit>()
      .add(UNIT_STATES.SPAWNING, new UnitSpawningState())
      .add(UNIT_STATES.MOVING, new UnitMovingState())
      .add(UNIT_STATES.ATTACKING, new UnitAttackingState())
      .build(this, UNIT_STATES.SPAWNING);

    if (DEBUG) {
      this.debug();
    }
  }

  get speed() {
    return this.blueprint.speed;
  }

  get attack() {
    return this.blueprint.attack;
  }

  get range() {
    return this.blueprint.range;
  }

  get maxHealth() {
    return this.blueprint.health;
  }

  get spawnTime() {
    return this.blueprint.spawnTime;
  }

  get enemyTowers() {
    return [...this.player.opponents].map(enemy => [...enemy.towers]).flat();
  }

  onPreUpdate(_engine: Engine, delta: number) {
    this.stateMachine.update(delta);
  }

  startMoving() {
    this.stateMachine.setState(UNIT_STATES.MOVING);
  }

  startAttacking() {
    this.stateMachine.setState(UNIT_STATES.ATTACKING);
  }

  debugAttackRange() {
    const color = Color.Red.clone();
    color.a = 0.25;

    const circle = new Circle({
      color,
      strokeColor: Color.Red,
      radius: (this.range * TILE_SIZE) / 2
    });

    const actor = new Actor({
      x: (this.blueprint.size.width * TILE_SIZE) / 2,
      y: (this.blueprint.size.height * TILE_SIZE) / 2
    });
    actor.graphics.use(circle);
    this.addChild(actor);
  }

  debug() {
    this.debugAttackRange();
  }
}
