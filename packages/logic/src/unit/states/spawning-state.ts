import type { State } from '../../utils/state-machine';
import { Unit } from '../unit.entity';

export class UnitSpawningState implements State<Unit> {
  spawnCountdown!: number;

  onEnter(unit: Unit) {
    this.spawnCountdown = unit.spawnTime();
  }

  onUpdate(unit: Unit, delta: number) {
    if (this.spawnCountdown <= 0) return;

    this.spawnCountdown -= delta;
    if (this.spawnCountdown <= 0) {
      unit.startMoving();
    }
  }
}
