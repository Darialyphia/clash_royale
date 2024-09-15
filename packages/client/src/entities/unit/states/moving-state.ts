import { Actor, Color, Vector } from 'excalibur';
import { Unit } from '../unit.entity';
import { State } from '@/utils/state-machine';
import { GameCoords } from '@/utils/game-coords';
import { TILE_SIZE } from '@/constants';

export class UnitMovingState implements State<Unit> {
  target: Unit | null = null;

  onEnter(unit: Unit) {
    unit.color = Color.Blue;
  }

  onExit(unit: Unit) {
    unit.vel = unit.vel.scale(0);
  }

  onUpdate(unit: Unit) {
    this.seek(unit);
    if (!this.target) return;
    const distance = GameCoords.fromScreenCoords(unit.pos).coords.distance(
      GameCoords.fromScreenCoords(this.target.pos).coords
    );

    if (distance <= unit.range) {
      unit.startAttacking();
    } else {
      this.move(unit);
    }
  }

  private move(unit: Unit) {
    if (this.target) {
      const direction = this.target.pos.sub(unit.pos).normalize();
      unit.vel = direction.scale(unit.speed * TILE_SIZE);
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
