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
    const distance = unit.position().dist(unit.target.position());
    if (distance <= unit.attackRange()) {
      unit.startAttacking();
    } else {
      unit.moveTowards(unit.target.position().sub(unit.position()));
    }
  }

  private seek(unit: Unit) {
    const [closestUnit] = unit
      .enemyUnits()
      .filter(enemy => unit.canAggro(enemy))
      .sort((a, b) => {
        return unit.position().dist(a.position()) - unit.position().dist(b.position());
      });

    if (closestUnit) {
      unit.target = closestUnit;

      return;
    }
    const [closestTower] = unit.enemyTowers().sort((a, b) => {
      return unit.position().dist(a.position()) - unit.position().dist(b.position());
    });
    if (closestTower) {
      unit.target = closestTower;
    }
  }
}
