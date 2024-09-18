import { TILE_SIZE } from '@/constants';
import { resources } from '@/resources';
import { SerializedTower } from '@game/logic';
import {
  Actor,
  Color,
  Font,
  FontUnit,
  GraphicsGroup,
  Label,
  TextAlign,
  Vector
} from 'excalibur';

export class TowerHealthBar extends Actor {
  private readonly text: Label;

  constructor(tower: SerializedTower) {
    super({ y: -TILE_SIZE });
    this.graphics.use(
      new GraphicsGroup({
        members: [
          resources.towerHealthBarSheet.getSpriteSheet()!.getSprite(0, 0)!,
          {
            graphic: resources.heartSheet.getSpriteSheet()!.getSprite(0, 0)!,
            offset: new Vector(-4, -5),
            useBounds: false
          }
        ]
      })
    );

    this.text = new Label({
      text: `${tower.health.current.toFixed()}`,
      x: -12,
      y: -12,
      width: TILE_SIZE,
      font: new Font({
        family: 'impact',
        size: 7,
        unit: FontUnit.Px,
        textAlign: TextAlign.Left,
        color: Color.White,
        shadow: {
          color: Color.Black,
          offset: new Vector(0, 2),
          blur: 3
        }
      })
    });

    this.addChild(this.text);
  }

  onStateUpdate(tower: SerializedTower) {
    this.text.text = `${tower.health.current.toFixed()}`;
  }
}
