import { TILE_SIZE, Z_INDICES } from '@/constants';
import { resources } from '@/resources';
import { SerializedUnit } from '@game/logic';
import { Actor, Color, Vector } from 'excalibur';

const HURTBAR_MAX_WIDTH = 14;

export class UnitHealthBar extends Actor {
  private hurtBar: Actor;

  constructor() {
    super({ y: -TILE_SIZE / 2, z: Z_INDICES.UI });

    this.graphics.use(resources.unitHealthBarSheet.getSpriteSheet()!.getSprite(0, 0)!);

    this.hurtBar = new Actor({
      color: Color.Red,
      x: HURTBAR_MAX_WIDTH / 2,
      y: 0,
      z: Z_INDICES.UI,
      width: HURTBAR_MAX_WIDTH,
      height: 2,
      scale: new Vector(0, 1),
      anchor: new Vector(1, 0.5)
    });

    this.addChild(this.hurtBar);
  }

  onStateUpdate(unit: SerializedUnit) {
    this.hurtBar.actions.scaleTo(
      new Vector(Math.min(1, 1 - unit.health.current / unit.health.max), 1),
      new Vector(2.5, 2.5)
    );
  }
}
