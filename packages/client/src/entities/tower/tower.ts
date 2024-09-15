import { DEBUG, TILE_SIZE, TOWER_HEIGHT, TOWER_WIDTH } from '@/constants';
import StateMachineBuilder from '@/utils/state-machine';
import { Values } from '@game/shared';
import { Actor, Circle, Color, Engine, Rectangle, Vector } from 'excalibur';
import { TowerIdleState } from './states/idle-state';
import { GameCoords } from '@/utils/game-coords';
import { resources } from '@/resources';
import { Player } from '../player/player';

export type TowerBlueprint = {
  attack: number;
  range: number;
  health: number;
};

const TOWER_STATES = {
  IDLE: 'idle'
} as const;

export type TowerState = Values<typeof TOWER_STATES>;

export class Tower extends Actor {
  private readonly blueprint: TowerBlueprint;
  readonly player: Player;

  private stateMachine = new StateMachineBuilder<Tower>()
    .add(TOWER_STATES.IDLE, new TowerIdleState())
    .build(this, TOWER_STATES.IDLE);
  health: number;

  constructor({
    position,
    blueprint,
    player
  }: {
    position: GameCoords;
    blueprint: TowerBlueprint;
    player: Player;
  }) {
    const { x, y } = position.toScreenCoords();
    super({
      x,
      y,
      width: TOWER_WIDTH * TILE_SIZE,
      height: TOWER_HEIGHT * TILE_SIZE,
      color: Color.DarkGray,
      anchor: new Vector(0, 0)
    });
    this.player = player;
    this.blueprint = blueprint;
    this.health = this.blueprint.health;

    this.addSprite();
    if (DEBUG) {
      this.debug();
    }
  }

  addSprite() {
    const graphics = resources.towersheet.getAnimation('idle')!;

    const sprite = new Actor({
      x: this.width - graphics.width,
      y: this.height - graphics.height,
      anchor: new Vector(0, 0)
    });

    sprite.graphics.use(graphics);
    this.addChild(sprite);
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

  onPreUpdate(_engine: Engine, delta: number) {
    this.stateMachine.update(delta);
  }

  debugAttackRange() {
    const color = Color.Red.clone();
    color.a = 0.3;

    const circle = new Circle({
      color,
      radius: this.range / 2
    });

    const actor = new Actor({
      x: (TOWER_WIDTH * TILE_SIZE) / 2,
      y: (TOWER_HEIGHT * TILE_SIZE) / 2
    });
    actor.graphics.use(circle);
    this.addChild(actor);
  }

  debugHitbox() {
    const color = Color.Blue.clone();
    color.a = 0.5;

    const rect = new Rectangle({
      height: TILE_SIZE,
      width: TILE_SIZE,
      color
    });

    const actor = new Actor({ x: 0, y: 0, anchor: new Vector(0, 0) });
    actor.graphics.use(rect);
    this.addChild(actor);
  }

  debug() {
    this.debugAttackRange();
    this.debugHitbox();
  }
}
