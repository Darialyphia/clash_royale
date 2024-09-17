import { Actor, Color, Font, FontUnit, Label, TextAlign } from 'excalibur';
import { TILE_SIZE, WIDTH } from '@/constants.ts';
import { SerializedPlayer } from '@game/logic';

export class ManaIndicatorActor extends Actor {
  private readonly text: Label;

  constructor(blueprint: {
    player: Pick<SerializedPlayer, 'currentMana'>;
    location: 'left' | 'right';
  }) {
    super({
      x: (blueprint.location === 'left' ? 0 : WIDTH - TILE_SIZE) + TILE_SIZE / 2,
      y: TILE_SIZE / 2,
      color: Color.Azure,
      height: TILE_SIZE,
      width: TILE_SIZE,
      visible: false
    });

    this.text = new Label({
      text: `${blueprint.player.currentMana.toFixed(2)}`,
      x: 0,
      y: -TILE_SIZE / 4,
      width: TILE_SIZE - 8,
      font: new Font({
        family: 'impact',
        size: 12,
        unit: FontUnit.Px,
        textAlign: TextAlign.Center
      })
    });

    this.addChild(this.text);
  }

  onStateUpdate(player: Pick<SerializedPlayer, 'currentMana'>) {
    this.text.text = `${player.currentMana.toFixed(2)}`;
  }
}
