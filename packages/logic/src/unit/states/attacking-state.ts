import type { State } from '../../utils/state-machine';
import { Unit } from '../unit.entity';

export class UnitAttackingState implements State<Unit> {
  attackCooldown = 0;

  onUpdate(unit: Unit, dt: number) {
    if (!unit.canAttack(unit.target!)) {
      unit.startMoving();
      return;
    }

    if (this.attackCooldown <= 0) {
      this.startNewAttack(unit);
    } else {
      this.attackCooldown -= dt;
    }
  }

  startNewAttack(unit: Unit) {
    console.log('whack !');
    this.attackCooldown = 1000 / unit.attackSpeed();
  }
}
