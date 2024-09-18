import {
  Vec2,
  type Milliseconds,
  type Point,
  type Serializable,
  type Values
} from '@game/shared';
import { Entity } from '../entity';
import type { StateMachine } from '../utils/state-machine';
import type { Player } from '../player/player.entity';
import StateMachineBuilder from '../utils/state-machine';
import { Interceptable, type inferInterceptor } from '../utils/interceptable';
import { UnitSpawningState } from './states/spawning-state';
import { UnitMovingState } from './states/moving-state';
import { UnitAttackingState } from './states/attacking-state';

/**
 * The shape of the input used to create a tower
 */
export type UnitBlueprint = {
  id: string;
  position: Point;
  attack: number;
  attackRange: number;
  aggroRange: number;
  health: number;
  spawnTime: Milliseconds;
  speed: number;
};

/**
 * The JSON serializable representation of a tower that is sent to the game session subscrbers
 */
export type SerializedUnit = {
  id: string;
  playerId: string;
  maxHealth: number;
  health: number;
  speed: number;
  attackRange: number;
  aggroRange: number;
  position: Point;
  velocity: Point;
  state: UnitState;
};

export const UNIT_STATES = {
  SPAWNING: 'spawning',
  MOVING: 'moving',
  ATTACKING: 'attacking'
} as const;

export type UnitState = Values<typeof UNIT_STATES>;

export type UnitInterceptor = Unit['interceptors'];

export class Unit extends Entity implements Serializable<SerializedUnit> {
  private readonly blueprint: UnitBlueprint;

  private stateMachine: StateMachine<Unit, UnitState>;

  readonly player: Player;

  private health: number;

  private pos: Vec2;

  private vel: Vec2;

  constructor({
    position,
    blueprint,
    player
  }: {
    position: Vec2;
    blueprint: UnitBlueprint;
    player: Player;
  }) {
    super(blueprint.id);
    this.player = player;
    this.blueprint = blueprint;
    this.pos = position;
    this.vel = new Vec2(0, 0);
    this.health = this.blueprint.health;
    this.stateMachine = new StateMachineBuilder<Unit>()
      .add(UNIT_STATES.SPAWNING, new UnitSpawningState())
      .add(UNIT_STATES.MOVING, new UnitMovingState())
      .add(UNIT_STATES.ATTACKING, new UnitAttackingState())
      .build(this, UNIT_STATES.SPAWNING);
  }

  private interceptors = {
    attack: new Interceptable<number, Unit>(),
    speed: new Interceptable<number, Unit>(),
    attackRange: new Interceptable<number, Unit>()
  };

  spawnTime() {
    return this.blueprint.spawnTime;
  }

  position() {
    return Vec2.from(this.pos);
  }

  velocity() {
    return Vec2.from(this.vel);
  }

  speed() {
    return this.interceptors.speed.getValue(this.blueprint.speed, this);
  }

  attack() {
    return this.interceptors.attack.getValue(this.blueprint.attack, this);
  }

  aggroRange() {
    return this.blueprint.aggroRange;
  }

  attackRange(): number {
    return this.interceptors.attackRange.getValue(this.blueprint.attackRange, this);
  }

  maxHealth() {
    return this.blueprint.health;
  }

  currentHealth() {
    return this.health;
  }

  update(delta: number) {
    this.stateMachine.update(delta);
  }

  addInterceptor<T extends keyof UnitInterceptor>(
    key: T,
    interceptor: inferInterceptor<UnitInterceptor[T]>,
    priority?: number
  ) {
    this.interceptors[key].add(interceptor as any, priority);
    return () => this.removeInterceptor(key, interceptor);
  }

  removeInterceptor<T extends keyof UnitInterceptor>(
    key: T,
    interceptor: inferInterceptor<UnitInterceptor[T]>
  ) {
    this.interceptors[key].remove(interceptor as any);
  }

  startMoving() {
    this.stateMachine.setState(UNIT_STATES.MOVING);
  }

  stopMoving() {
    this.vel.scale({ x: 0, y: 0 });
  }

  moveTowards(vec: Vec2) {
    this.vel = vec;
  }

  startAttacking() {
    this.stateMachine.setState(UNIT_STATES.ATTACKING);
  }

  serialize() {
    return {
      id: this.id,
      playerId: this.player.id,
      health: this.health,
      maxHealth: this.maxHealth(),
      attackRange: this.attackRange(),
      aggroRange: this.aggroRange(),
      position: this.pos.serialize(),
      velocity: this.vel.serialize(),
      speed: this.speed(),
      state: this.stateMachine.state()
    };
  }
}
