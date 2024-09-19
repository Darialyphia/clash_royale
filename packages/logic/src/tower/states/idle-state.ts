import type { State } from '../../utils/state-machine';
import { Tower } from '../tower.entity';

export class TowerIdleState implements State<Tower> {
  spawnCountdown!: number;

  onUpdate(tower: Tower) {
    this.seek(tower);
  }

  private seek(tower: Tower) {
    const [closestUnit] = tower
      .enemyUnits()
      .filter(enemy => tower.canAttack(enemy))
      .sort((a, b) => {
        return tower.position().dist(a.position()) - tower.position().dist(b.position());
      });

    if (closestUnit) {
      tower.switchTarget(closestUnit);
      tower.startAttacking();
    }
  }
}
