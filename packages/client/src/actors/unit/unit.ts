import { Actor, Circle, Color, Vector } from 'excalibur';
import { DEBUG, TILE_SIZE } from '@/constants';
import { GameCoords, toScreen } from '@/utils/game-coords';
import { SerializedUnit, UNIT_STATES, UnitState } from '@game/logic';

const unitColors: Record<UnitState, Color> = {
  [UNIT_STATES.SPAWNING]: Color.Magenta,
  [UNIT_STATES.MOVING]: Color.Blue,
  [UNIT_STATES.ATTACKING]: Color.Red
};

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
      color: Color.Magenta
    });

    this.maxHealth = blueprint.health.max;
    this.health = blueprint.health.current;
    this.attackRange = blueprint.attackRange;
    this.aggroRange = blueprint.aggroRange;

    if (DEBUG) {
      this.debug();
    }
  }

  onStateUpdate(newUnit: SerializedUnit) {
    this.health = newUnit.health.current;
    this.maxHealth = newUnit.health.max;
    this.attackRange = toScreen(newUnit.attackRange);
    this.aggroRange = toScreen(newUnit.aggroRange);
    this.color = unitColors[newUnit.state];
    // There is a bug with Excalibur's Vector.normalize() that returns {0,1} when normalizing a vector with a mmagnitude of 0
    // it swill be fixed in the next Excalibur Vue.version
    // see https://github.com/excaliburjs/Excalibur/commit/46ba314ebb751214dffb63ed1465adededfd8ec7#diff-06572a96a58dc510037d5efa622f9bec8519bc1beab13c9f251e97e657a9d4ed
    const vel = new Vector(newUnit.velocity.x, newUnit.velocity.y);
    if (vel.distance() === 0) {
      this.vel = Vector.Zero;
    } else {
      this.vel = vel.normalize().scale(toScreen(newUnit.speed));
    }
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
