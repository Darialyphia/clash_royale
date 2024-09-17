import { type Point, type Serializable, type Values, Vec2 } from '@game/shared';
import { Entity } from '../entity';
import type { StateMachine } from '../utils/state-machine';
import type { Player } from '../player/player.entity';
import StateMachineBuilder from '../utils/state-machine';
import { TowerIdleState } from './states/idle-state';
import { Interceptable, type inferInterceptor } from '../utils/interceptable';

/**
 * The shape of the input used to create a tower
 */
export type TowerBlueprint = {
  id: string;
  attack: number;
  attackRange: number;
  health: number;
};

/**
 * The JSON serializable representation of a tower that is sent to the game session subscrbers
 */
export type SerializedTower = {
  id: string;
  pos: Point;
  maxHealth: number;
  health: number;
  playerId: string;
  attackRange: number;
};

const TOWER_STATES = {
  IDLE: 'idle'
} as const;

export type TowerState = Values<typeof TOWER_STATES>;

export type TowerInterceptor = Tower['interceptors'];

export class Tower extends Entity implements Serializable<SerializedTower> {
  private stateMachine: StateMachine<Tower, TowerState>;

  private readonly blueprint: TowerBlueprint;

  private pos: Vec2;

  readonly player: Player;

  private health: number;

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
    this.pos = position;
    this.health = this.blueprint.health;
    this.stateMachine = new StateMachineBuilder<Tower>()
      .add(TOWER_STATES.IDLE, new TowerIdleState())
      .build(this, TOWER_STATES.IDLE);
  }

  private interceptors = {
    attack: new Interceptable<number, Tower>(),
    attackRange: new Interceptable<number, Tower>()
  };

  position() {
    return Vec2.from(this.pos);
  }

  attack(): number {
    return this.interceptors.attack.getValue(this.blueprint.attack, this);
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

  serialize() {
    return {
      id: this.id,
      playerId: this.player.id,
      pos: this.pos,
      health: this.health,
      maxHealth: this.maxHealth(),
      attackRange: this.attackRange()
    };
  }
}
