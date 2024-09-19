import { TILE_SIZE, Z_INDICES } from '@/constants';
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

const HURTBAR_MAX_WIDTH = 30;

export class TowerHealthBar extends Actor {
  private readonly text: Label;

  private readonly hurtBar: Actor;

  constructor(tower: SerializedTower) {
    super({ y: -TILE_SIZE, z: Z_INDICES.UI });

    this.graphics.use(
      new GraphicsGroup({
        members: [
          resources.towerHealthBarSheet.getSpriteSheet()!.getSprite(0, 0)!,
          {
            graphic: resources.heartSheet.getSpriteSheet()!.getSprite(0, 0)!,
            offset: new Vector(-4, -6),
            useBounds: false
          }
        ]
      })
    );

    this.text = new Label({
      text: `${tower.health.current.toFixed()}`,
      x: -8,
      y: -10,
      z: Z_INDICES.UI,
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

    this.hurtBar = new Actor({
      color: Color.Red,
      x: HURTBAR_MAX_WIDTH / 2,
      y: 0,
      z: Z_INDICES.UI,
      width: HURTBAR_MAX_WIDTH,
      height: 4,
      scale: new Vector(0, 1),
      anchor: new Vector(1, 0.5)
    });

    this.addChild(this.text);
    this.addChild(this.hurtBar);
  }

  onStateUpdate(tower: SerializedTower) {
    this.text.text = `${tower.health.current.toFixed()}`;

    this.hurtBar.scale.x = Math.min(1, 1 - tower.health.current / tower.health.max);
  }
}
