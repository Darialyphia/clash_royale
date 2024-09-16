import { State } from '@/utils/state-machine';
import { Unit } from '../unit.entity';
import { Color } from 'excalibur';

export class UnitAttackingState implements State<Unit> {
  onEnter(unit: Unit) {
    unit.color = Color.Red;
  }
  onUpdate() {}
}
