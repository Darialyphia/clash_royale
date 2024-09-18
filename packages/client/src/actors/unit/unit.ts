import { Actor, Circle, Color, Vector } from 'excalibur';
import { DEBUG, TILE_SIZE } from '@/constants';
import { GameCoords, toScreen } from '@/utils/game-coords';
import { SerializedUnit } from '@game/logic';

export class UnitActor extends Actor {
  health: number;

  maxHealth: number;

  attackRange: number;

  aggroRange: number;

  constructor(blueprint: SerializedUnit) {
    const { x, y } = new GameCoords(blueprint.body.x, blueprint.body.y).toScreenCoords();

    super({
      x,
      y,
      width: toScreen(blueprint.body.width),
      height: toScreen(blueprint.body.height),
      color: Color.Blue
    });

    this.maxHealth = blueprint.health.max;
    this.health = blueprint.health.current;
    this.attackRange = blueprint.attackRange;
    this.aggroRange = blueprint.aggroRange;

    if (DEBUG) {
      this.debug();
    }
  }

  onStateUpdate(newTower: SerializedUnit) {
    this.health = newTower.health.current;
    this.maxHealth = newTower.health.max;
    this.attackRange = toScreen(newTower.attackRange);
    this.aggroRange = toScreen(newTower.aggroRange);
    this.vel = new Vector(newTower.velocity.x, newTower.velocity.y)
      .normalize()
      .scale(toScreen(newTower.speed));
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
