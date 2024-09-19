import { Tower } from '../../tower/tower.entity';
import type { State } from '../../utils/state-machine';
import { Unit } from '../unit.entity';

export class UnitMovingState implements State<Unit> {
  onExit(unit: Unit) {
    unit.stopMoving();
  }

  onUpdate(unit: Unit) {
    this.seek(unit);
    if (!unit.target) return;
    if (unit.canAttack(unit.target)) {
      unit.startAttacking();
    } else {
      unit.moveTowards(unit.target.position().sub(unit.position()));
    }
  }

  private seek(unit: Unit) {
    const oldTarget = unit.target;

    const [closestTower] = unit.enemyTowers().sort((a, b) => {
      return unit.position().dist(a.position()) - unit.position().dist(b.position());
    });
    if (closestTower) {
      unit.target = closestTower;
    }

    const [closestUnit] = unit
      .enemyUnits()
      .filter(enemy => unit.canAggro(enemy))
      .sort((a, b) => {
        return unit.position().dist(a.position()) - unit.position().dist(b.position());
      });

    if (closestUnit) {
      unit.target = closestUnit;
    }

    if (unit.target && unit.target !== oldTarget) {
      console.log('switched target to', unit.target.id);
    }
  }
}
