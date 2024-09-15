import { Actor } from 'excalibur';
import { Unit } from '../unit.entity';
import { State } from '@/utils/state-machine';

export class UnitMovingState implements State<Unit> {
  target: Unit | null = null;

  onUpdate(unit: Unit) {
    this.seek(unit);

    if (!this.target) return;
    const distance = unit.pos.distance(this.target.pos);
    if (distance <= unit.range) {
      unit.startAttacking();
    } else {
      this.move(unit);
    }
  }

  private move(unit: Unit) {
    if (this.target) {
      const direction = this.target.pos.sub(unit.pos).normalize();
      unit.vel = direction.scale(unit.speed);
    }
  }

  private seek(unit: Unit) {
    if (this.target) return;

    let closestDistance = Infinity;
    let closestTarget: Actor | null = null;

    unit.enemyTowers.forEach(target => {
      const distance = unit.pos.distance(target.pos);
      if (distance >= closestDistance) return;

      closestDistance = distance;
      closestTarget = target;
    });

    this.target = closestTarget;
  }
}
