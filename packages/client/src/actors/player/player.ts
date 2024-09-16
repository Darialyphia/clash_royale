import { ManaIndicatorActor } from '@/actors/mana/mana-indicator';
import { Actor } from 'excalibur';
import { SerializedTeam } from '@game/logic';

export type PlayerId = string;

export class PlayerActor extends Actor {
  manaIndicator: ManaIndicatorActor;
  constructor(blueprint: {
    player: SerializedTeam['players'][number];
    location: 'left' | 'right';
  }) {
    super({
      x: 0,
      y: 0,
      visible: false
    });
    this.manaIndicator = new ManaIndicatorActor({
      player: blueprint.player,
      location: blueprint.location
    });
    this.addChild(this.manaIndicator);
  }

  onStateUpdate(player: SerializedTeam['players'][number]) {
    this.manaIndicator.onStateUpdate(player);
  }
}
