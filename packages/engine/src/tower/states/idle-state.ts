import { State } from '@/utils/state-machine';
import { Tower } from '../tower';

export class TowerIdleState implements State<Tower> {
  spawnCountdown!: number;

  onUpdate(tower: Tower, delta: number) {}
}
