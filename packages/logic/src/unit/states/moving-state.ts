import type { Tower } from '../../tower/tower.entity';
import type { State } from '../../utils/state-machine';
import { Unit } from '../unit.entity';

export class UnitMovingState implements State<Unit> {
  target: Unit | Tower | null = null;

  onExit(unit: Unit) {
    unit.stopMoving();
  }

  onUpdate(unit: Unit) {
    this.seek(unit);
    if (!this.target) return;
    const distance = unit.position().dist(this.target.position());

    if (distance <= unit.attackRange()) {
      unit.startAttacking();
    } else {
      this.move(unit);
    }
  }

  private move(unit: Unit) {
    if (!this.target) return;
    unit.seek(this.target.position().sub(unit.position()));
  }

  private seek(unit: Unit) {
    if (this.target) return;

    // let closestDistance = Infinity;
    // let closestTarget: Tower | Unit = null;

    // unit.enemyTowers.forEach(target => {
    //   const distance = unit.pos.distance(target.pos);
    //   if (distance >= closestDistance) return;

    //   closestDistance = distance;
    //   closestTarget = target;
    // });

    // this.target = closestTarget;
  }
}
