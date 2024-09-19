import {
  Bbox,
  Vec2,
  type AnyFunction,
  type Circle,
  type Milliseconds,
  type Point,
  type Rectangle,
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
import type { Tower } from '../tower/tower.entity';
import { TypedEventEmitter } from '../utils/typed-emitter';

/**
 * The shape of the input used to create a tower
 */
export type UnitBlueprint = {
  id: string;
  attack: number;
  attackRange: number;
  attackSpeed: number; // attacks per second
  aggroRange: number;
  health: number;
  spawnTime: Milliseconds;
  speed: number;
  width: number;
  height: number;
};

/**
 * The JSON serializable representation of a tower that is sent to the game session subscrbers
 */
export type SerializedUnit = {
  id: string;
  playerId: string;
  health: { current: number; max: number };
  attackRange: number;
  aggroRange: number;
  body: Rectangle; // body origin is its center, not top left
  state: UnitState;
  orientation: 'left' | 'right';
  // Note: going to experient letting excalibur do the heavy lifting client site interpolation wise.
  // If it doesnt work out, we can remove those 2 properties
  velocity: Point;
  speed: number;
};

export const UNIT_STATES = {
  SPAWNING: 'spawning',
  MOVING: 'moving',
  ATTACKING: 'attacking'
} as const;
export type UnitState = Values<typeof UNIT_STATES>;

export const UNIT_ORIENTATION = {
  LEFT: 'left',
  RIGHT: 'right'
} as const;
export type UnitOrientation = Values<typeof UNIT_ORIENTATION>;

const UNIT_EVENTS = {
  DESTROY: 'UNIT:DESTROY'
} as const;

export type UnitEvent = {
  [UNIT_EVENTS.DESTROY]: [Unit];
};

export type UnitInterceptor = Unit['interceptors'];

export class Unit extends Entity implements Serializable<SerializedUnit> {
  private readonly blueprint: UnitBlueprint;

  private stateMachine: StateMachine<Unit, UnitState>;

  private emitter = new TypedEventEmitter<UnitEvent>();

  readonly player: Player;

  private currentTarget: Unit | Tower | null = null;

  // The target event subscruber function cleanups to runwhen the unit switches target
  private currentTargetCleanups: AnyFunction[] = [];

  private health: number;

  private _bbox: Bbox;

  private vel: Vec2;

  private interceptors = {
    attack: new Interceptable<number, Unit>(),
    speed: new Interceptable<number, Unit>(),
    attackRange: new Interceptable<number, Unit>(),
    attackSpeed: new Interceptable<number, Unit>()
  };

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
    this._bbox = new Bbox(position, blueprint.width, blueprint.height);
    this.vel = new Vec2(0, 0);
    this.health = this.blueprint.health;
    this.stateMachine = new StateMachineBuilder<Unit>()
      .add(UNIT_STATES.SPAWNING, new UnitSpawningState())
      .add(UNIT_STATES.MOVING, new UnitMovingState())
      .add(UNIT_STATES.ATTACKING, new UnitAttackingState())
      .build(this, UNIT_STATES.SPAWNING);

    this.onLoseTarget = this.onLoseTarget.bind(this);
  }

  serialize() {
    return {
      id: this.id,
      playerId: this.player.id,
      state: this.stateMachine.state(),
      health: { current: this.health, max: this.maxHealth() },
      attackRange: this.attackRange(),
      aggroRange: this.aggroRange(),
      body: this._bbox.serialize(),
      velocity: this.vel.serialize(),
      orientation:
        this.currentTarget && this.currentTarget.position().x < this.position().x
          ? UNIT_ORIENTATION.LEFT
          : UNIT_ORIENTATION.RIGHT,
      speed: this.speed()
    };
  }

  update(delta: number) {
    this.stateMachine.update(delta);
    this._bbox.moveTo(
      Vec2.from(this._bbox).add(this.vel.normalize().scale((this.speed() * delta) / 1000))
    );
  }

  spawnTime() {
    return this.blueprint.spawnTime;
  }

  bbox() {
    return this._bbox.clone();
  }

  position() {
    return Vec2.from(this._bbox);
  }

  velocity() {
    return Vec2.from(this.vel);
  }

  target() {
    return this.currentTarget;
  }

  private onLoseTarget() {
    this.startMoving();
  }

  switchTarget(target: Unit | Tower | null) {
    this.currentTargetCleanups.forEach(fn => fn());
    this.currentTargetCleanups = [];

    this.currentTarget = target;
    if (this.currentTarget) {
      this.currentTargetCleanups.push(
        this.currentTarget.subscribeDestroyed(this.onLoseTarget)
      );
    }
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

  attackSpeed() {
    return this.interceptors.attackSpeed.getValue(this.blueprint.attackSpeed, this);
  }

  attackRadius(): Circle {
    return {
      ...this.position(),
      radius: this.attackRange()
    };
  }

  aggroRadius(): Circle {
    return {
      ...this.position(),
      radius: this.aggroRange()
    };
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

  enemies() {
    return this.player
      .opponents()
      .map(player => [...player.units, ...player.towers])
      .flat();
  }

  enemyUnits() {
    return this.player
      .opponents()
      .map(player => [...player.units])
      .flat();
  }

  enemyTowers() {
    return this.player
      .opponents()
      .map(player => [...player.towers])
      .flat();
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

  canAttack(entity: Unit | Tower) {
    return entity.bbox().intersectsCircle(this.attackRadius());
  }

  canAggro(entity: Unit) {
    return entity.bbox().intersectsCircle(this.aggroRadius());
  }

  startMoving() {
    this.stateMachine.setState(UNIT_STATES.MOVING);
  }

  stopMoving() {
    this.vel.scale(0);
  }

  moveTowards(vec: Vec2) {
    this.vel = vec;
  }

  startAttacking() {
    this.stateMachine.setState(UNIT_STATES.ATTACKING);
  }

  dealDamage(target: Unit | Tower) {
    target.takeDamage(this.attack());
  }

  takeDamage(amount: number) {
    this.health = Math.max(0, this.health - amount);

    if (this.health === 0) {
      this.emitter.emit(UNIT_EVENTS.DESTROY, this);
    }
  }

  subscribeDestroyed(cb: (unit: Unit) => void) {
    return this.emitter.once(UNIT_EVENTS.DESTROY, cb);
  }
}
