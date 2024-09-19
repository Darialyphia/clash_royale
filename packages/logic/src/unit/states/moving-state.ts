import type { Tower } from '../../tower/tower.entity';
import type { State } from '../../utils/state-machine';
import { Unit } from '../unit.entity';

export class UnitMovingState implements State<Unit> {
  onExit(unit: Unit) {
    unit.stopMoving();
  }

  onUpdate(unit: Unit) {
    this.seek(unit);
    const target = unit.target();
    if (!target) return;
    if (unit.canAttack(target)) {
      unit.startAttacking();
    } else {
      unit.moveTowards(target.position().sub(unit.position()));
    }
  }

  private seek(unit: Unit) {
    let newTarget: Unit | Tower | null = null;
    const [closestTower] = unit.enemyTowers().sort((a, b) => {
      return unit.position().dist(a.position()) - unit.position().dist(b.position());
    });
    if (closestTower) {
      newTarget = closestTower;
    }

    const [closestUnit] = unit
      .enemyUnits()
      .filter(enemy => unit.canAggro(enemy))
      .sort((a, b) => {
        return unit.position().dist(a.position()) - unit.position().dist(b.position());
      });

    if (closestUnit) {
      newTarget = closestUnit;
    }

    unit.switchTarget(newTarget);
  }
}
