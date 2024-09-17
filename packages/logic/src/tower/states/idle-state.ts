import type { State } from '../../utils/state-machine';
import { Tower } from '../tower.entity';

export class TowerIdleState implements State<Tower> {
  spawnCountdown!: number;

  onUpdate(_tower: Tower, _delta: number) {}
}
