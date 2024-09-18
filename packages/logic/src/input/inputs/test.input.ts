import { z } from 'zod';
import { defaultInputSchema, Input } from '../input';
import type { GameSession } from '../../game-session';
import type { Player } from '../../player/player.entity';

const schema = defaultInputSchema.extend({
  x: z.number(),
  y: z.number()
});
export class TestInput extends Input<typeof schema> {
  readonly name = 'test';

  protected payloadSchema = schema;

  impl(session: GameSession, player: Player) {
    player.deployUnit(
      {
        aggroRange: 2,
        attackRange: 1,
        attack: 10,
        health: 50,
        height: 0.5,
        width: 0.5,
        spawnTime: 500,
        speed: 1
      },
      this.payload
    );
  }
}
