import {
  type AnyFunction,
  Bbox,
  type Circle,
  type Rectangle,
  type Serializable,
  type Values,
  Vec2
} from '@game/shared';
import { Entity } from '../entity';
import type { StateMachine } from '../utils/state-machine';
import type { Player } from '../player/player.entity';
import StateMachineBuilder from '../utils/state-machine';
import { TowerIdleState } from './states/idle-state';
import { Interceptable, type inferInterceptor } from '../utils/interceptable';
import { TowerAttackingState } from './states/attacking-state';
import type { Unit } from '../unit/unit.entity';
import { TypedEventEmitter } from '../utils/typed-emitter';

/**
 * The shape of the input used to create a tower
 */
export type TowerBlueprint = {
  id: string;
  attack: number;
  attackRange: number;
  attackSpeed: number;
  health: number;
  width: number;
  height: number;
};

/**
 * The JSON serializable representation of a tower that is sent to the game session subscrbers
 */
export type SerializedTower = {
  id: string;
  playerId: string;
  body: Rectangle; // body origin is its center, not top left
  health: { current: number; max: number };
  attackRange: number;
  state: TowerState;
};

export const TOWER_STATES = {
  IDLE: 'idle',
  ATTACKING: 'attacking'
} as const;

export type TowerState = Values<typeof TOWER_STATES>;

const TOWER_EVENTS = {
  DESTROY: 'TOWER:DESTROY'
} as const;

export type TowerEvent = {
  [TOWER_EVENTS.DESTROY]: [Tower];
};

export type TowerInterceptor = Tower['interceptors'];

export class Tower extends Entity implements Serializable<SerializedTower> {
  private stateMachine: StateMachine<Tower, TowerState>;

  private emitter = new TypedEventEmitter<TowerEvent>();

  private readonly blueprint: TowerBlueprint;

  private _bbox: Bbox;

  readonly player: Player;

  private health: number;

  private currentTarget: Unit | null = null;

  // The target event subscruber function cleanups to runwhen the tower switches target
  private currentTargetCleanups: AnyFunction[] = [];

  private interceptors = {
    attack: new Interceptable<number, Tower>(),
    attackRange: new Interceptable<number, Tower>(),
    attackSpeed: new Interceptable<number, Tower>()
  };

  constructor({
    position,
    blueprint,
    player
  }: {
    position: Vec2;
    blueprint: TowerBlueprint;
    player: Player;
  }) {
    super(blueprint.id);
    this.player = player;
    this.blueprint = blueprint;
    this._bbox = new Bbox(position, blueprint.width, blueprint.height);
    this.health = this.blueprint.health;
    this.stateMachine = new StateMachineBuilder<Tower>()
      .add(TOWER_STATES.IDLE, new TowerIdleState())
      .add(TOWER_STATES.ATTACKING, new TowerAttackingState())
      .build(this, TOWER_STATES.IDLE);

    this.onLoseTarget = this.onLoseTarget.bind(this);
  }

  serialize() {
    return {
      id: this.id,
      playerId: this.player.id,
      body: this._bbox.serialize(),
      width: this._bbox.width,
      height: this._bbox.height,
      health: { current: this.health, max: this.maxHealth() },
      attackRange: this.attackRange(),
      state: this.stateMachine.state()
    };
  }

  bbox() {
    return this._bbox.clone();
  }

  position() {
    return Vec2.from(this._bbox);
  }

  attack(): number {
    return this.interceptors.attack.getValue(this.blueprint.attack, this);
  }

  attackRange(): number {
    return this.interceptors.attackRange.getValue(this.blueprint.attackRange, this);
  }

  attackRadius(): Circle {
    return {
      ...this.position(),
      radius: this.attackRange()
    };
  }

  attackSpeed() {
    return this.interceptors.attackSpeed.getValue(this.blueprint.attackSpeed, this);
  }

  maxHealth() {
    return this.blueprint.health;
  }

  currentHealth() {
    return this.health;
  }

  enemyUnits() {
    return this.player
      .opponents()
      .map(player => [...player.units])
      .flat();
  }

  update(delta: number) {
    this.stateMachine.update(delta);
  }

  addInterceptor<T extends keyof TowerInterceptor>(
    key: T,
    interceptor: inferInterceptor<TowerInterceptor[T]>,
    priority?: number
  ) {
    this.interceptors[key].add(interceptor as any, priority);
    return () => this.removeInterceptor(key, interceptor);
  }

  removeInterceptor<T extends keyof TowerInterceptor>(
    key: T,
    interceptor: inferInterceptor<TowerInterceptor[T]>
  ) {
    this.interceptors[key].remove(interceptor as any);
  }

  target() {
    return this.currentTarget;
  }

  private onLoseTarget() {
    this.stopAttacking();
  }

  switchTarget(target: Unit | null) {
    this.currentTargetCleanups.forEach(fn => fn());
    this.currentTargetCleanups = [];

    this.currentTarget = target;
    if (this.currentTarget) {
      this.currentTargetCleanups.push(
        this.currentTarget.subscribeDestroyed(this.onLoseTarget)
      );
    }
  }

  canAttack(entity: Unit) {
    return entity.bbox().intersectsCircle(this.attackRadius());
  }

  startAttacking() {
    this.stateMachine.setState(TOWER_STATES.ATTACKING);
  }

  stopAttacking() {
    this.switchTarget(null);
    this.stateMachine.setState(TOWER_STATES.IDLE);
  }

  dealDamage(target: Unit | Tower) {
    target.takeDamage(this.attack());
  }

  takeDamage(amount: number) {
    this.health = Math.max(0, this.health - amount);

    if (this.health === 0) {
      this.emitter.emit(TOWER_EVENTS.DESTROY, this);
    }
  }

  subscribeDestroyed(cb: (tower: Tower) => void) {
    return this.emitter.once(TOWER_EVENTS.DESTROY, cb);
  }
}
