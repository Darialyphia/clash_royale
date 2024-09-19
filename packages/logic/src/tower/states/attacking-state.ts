import type { State } from '../../utils/state-machine';
import { Tower } from '../tower.entity';

export class TowerAttackingState implements State<Tower> {
  private attackCooldown = 0;

  onUpdate(tower: Tower, dt: number) {
    if (!tower.canAttack(tower.target()!)) {
      tower.stopAttacking();
      return;
    }
    if (this.attackCooldown <= 0) {
      this.startNewAttack(tower);
    } else {
      this.attackCooldown -= dt;
    }
  }

  startNewAttack(tower: Tower) {
    tower.dealDamage(tower.target()!);
    this.attackCooldown = 1000 / tower.attackSpeed();
  }
}
