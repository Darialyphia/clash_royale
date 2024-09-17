import { Actor, Circle, Color, Vector } from 'excalibur';
import { DEBUG, TILE_SIZE, UNIT_HEIGHT, UNIT_WIDTH } from '@/constants';
import { GameCoords, toScreen } from '@/utils/game-coords';
import { SerializedUnit } from '@game/logic';

export class UnitActor extends Actor {
  health: number;

  maxHealth: number;

  attackRange: number;

  aggroRange: number;

  constructor(blueprint: SerializedUnit) {
    const { x, y } = new GameCoords(
      blueprint.position.x,
      blueprint.position.y
    ).toScreenCoords();
    super({
      x,
      y,
      width: TILE_SIZE / 2,
      height: TILE_SIZE / 2,
      color: Color.Blue
    });

    this.maxHealth = blueprint.maxHealth;
    this.health = blueprint.health;
    this.attackRange = blueprint.attackRange;
    this.aggroRange = blueprint.aggroRange;

    if (DEBUG) {
      this.debug();
    }
  }

  onStateUpdate(newTower: SerializedUnit) {
    this.health = newTower.health;
    this.maxHealth = newTower.maxHealth;
    this.attackRange = toScreen(newTower.attackRange);
    this.aggroRange = toScreen(newTower.aggroRange);
    this.vel = new Vector(newTower.velocity.x, newTower.velocity.y)
      .normalize()
      .scale(TILE_SIZE);
  }

  debugAttackRange() {
    const color = Color.Red;
    color.a = 0.15;

    const circle = new Circle({
      color,
      strokeColor: Color.Red,
      radius: (this.attackRange * TILE_SIZE) / 2
    });

    const actor = new Actor({
      x: 0,
      y: 0
    });
    actor.graphics.use(circle);
    this.addChild(actor);
  }

  debugAggroRange() {
    const color = Color.Orange;
    color.a = 0.15;

    const circle = new Circle({
      color,
      strokeColor: Color.Red,
      radius: (this.aggroRange * TILE_SIZE) / 2
    });

    const actor = new Actor({
      x: 0,
      y: 0
    });
    actor.graphics.use(circle);
    this.addChild(actor);
  }

  debug() {
    this.debugAggroRange();
    this.debugAttackRange();
  }
}
