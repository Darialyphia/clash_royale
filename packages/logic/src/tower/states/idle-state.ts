import type { State } from '../../utils/state-machine';
import { Tower } from '../tower.entity';

export class TowerIdleState implements State<Tower> {
  spawnCountdown!: number;

  onUpdate(tower: Tower, delta: number) {}
}
