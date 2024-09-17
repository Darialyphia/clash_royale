import type { State } from '../../utils/state-machine';
import { Tower } from '../tower';

export class TowerIdleState implements State<Tower> {
  _spawnCountdown!: number;

  onUpdate(_tower: Tower, _delta: number) {}
}
