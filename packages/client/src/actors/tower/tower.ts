import { DEBUG, TILE_SIZE } from '@/constants';
import { Actor, Circle, Color, Rectangle } from 'excalibur';
import { toScreen, toScreenVector } from '@/utils/game-coords';
import { resources } from '@/resources';

import { SerializedTower } from '@game/logic';
import { TowerHealthBar } from './tower-health-bar';

export class TowerActor extends Actor {
  attackRange: number;

  maxHealth: number;

  health: number;

  private readonly healthBar: TowerHealthBar;

  constructor(blueprint: SerializedTower) {
    const { x, y } = toScreenVector(blueprint.body);

    super({
      x,
      y,
      width: toScreen(blueprint.body.width),
      height: toScreen(blueprint.body.height),
      color: Color.DarkGray
    });
    this.attackRange = toScreen(blueprint.attackRange);
    this.maxHealth = blueprint.health.max;
    this.health = blueprint.health.current;

    this.healthBar = new TowerHealthBar(blueprint);
    this.addSprite();
    this.addChild(this.healthBar);
    if (DEBUG) {
      this.debug();
    }
  }

  onStateUpdate(newTower: SerializedTower) {
    this.health = newTower.health.current;
    this.maxHealth = newTower.health.max;
    this.attackRange = toScreen(newTower.attackRange);

    this.healthBar.onStateUpdate(newTower);
  }

  addSprite() {
    const graphics = resources.towerSheet.getAnimation('idle')!;
    const sprite = new Actor({
      x: (this.width - graphics.width) / 2,
      y: (this.height - graphics.height) / 2
    });

    sprite.graphics.use(graphics);
    this.addChild(sprite);
  }

  debugAttackRange() {
    const color = Color.Red.clone();
    color.a = 0.15;

    const circle = new Circle({
      color,
      strokeColor: Color.Red,
      radius: this.attackRange / 2
    });

    const actor = new Actor({
      x: 0,
      y: 0
    });
    actor.graphics.use(circle);
    this.addChild(actor);
  }

  debugHitbox() {
    const color = Color.Blue.clone();
    color.a = 0.25;

    const rect = new Rectangle({
      height: TILE_SIZE,
      width: TILE_SIZE,
      color,
      strokeColor: Color.Blue
    });

    const actor = new Actor({ x: 0, y: 0 });
    actor.graphics.use(rect);
    this.addChild(actor);
  }

  debug() {
    this.debugAttackRange();
    this.debugHitbox();
  }
}
