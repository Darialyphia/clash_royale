import type { State } from '../../utils/state-machine';
import { Unit } from '../unit.entity';

export class UnitAttackingState implements State<Unit> {
  onUpdate() {
    return;
  }
}
