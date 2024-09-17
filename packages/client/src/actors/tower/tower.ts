import { DEBUG, TILE_SIZE, TOWER_HEIGHT, TOWER_WIDTH } from '@/constants';
import { Actor, Circle, Color, Rectangle, Vector } from 'excalibur';
import { GameCoords, toScreen } from '@/utils/game-coords';
import { resources } from '@/resources';

import { SerializedTower } from '@game/logic';

export class TowerActor extends Actor {
  attackRange: number;

  maxHealth: number;

  health: number;

  constructor(blueprint: SerializedTower) {
    const { x, y } = new GameCoords(
      blueprint.position.x,
      blueprint.position.y
    ).toScreenCoords();

    super({
      x,
      y,
      width: TOWER_WIDTH * TILE_SIZE,
      height: TOWER_HEIGHT * TILE_SIZE,
      color: Color.DarkGray,
      anchor: new Vector(0, 0)
    });

    this.attackRange = toScreen(blueprint.attackRange);
    this.maxHealth = blueprint.maxHealth;
    this.health = blueprint.health;

    this.addSprite();
    if (DEBUG) {
      this.debug();
    }
  }

  onStateUpdate(newTower: SerializedTower) {
    this.health = newTower.health;
    this.maxHealth = newTower.maxHealth;
    this.attackRange = toScreen(newTower.attackRange);
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

  debugAttackRange() {
    const color = Color.Red.clone();
    color.a = 0.15;

    const circle = new Circle({
      color,
      strokeColor: Color.Red,
      radius: this.attackRange / 2
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
    color.a = 0.25;

    const rect = new Rectangle({
      height: TILE_SIZE,
      width: TILE_SIZE,
      color,
      strokeColor: Color.Blue
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
