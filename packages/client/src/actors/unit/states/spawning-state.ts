import { State } from '@/utils/state-machine';
import { Unit } from '../unit.entity';
import { Color } from 'excalibur';

export class UnitSpawningState implements State<Unit> {
  spawnCountdown!: number;

  onEnter(unit: Unit) {
    this.spawnCountdown = unit.spawnTime;
    unit.color = Color.Yellow;
  }

  onUpdate(unit: Unit, delta: number) {
    if (this.spawnCountdown <= 0) return;

    this.spawnCountdown -= delta;
    if (this.spawnCountdown <= 0) {
      unit.startMoving();
    }
  }
}
