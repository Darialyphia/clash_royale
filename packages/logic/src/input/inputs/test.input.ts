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

  impl(_session: GameSession, player: Player) {
    player.deployUnit(
      {
        aggroRange: 2,
        attackRange: 1,
        attackSpeed: 1.4,
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

const cardSchema = defaultInputSchema.extend({
  card2play: z.literal(0).or(z.literal(1)).or(z.literal(2)).or(z.literal(3))
});
export class CardTestInput extends Input<typeof cardSchema> {
  readonly name = 'card-test';

  protected payloadSchema = cardSchema;

  impl(_session: GameSession, player: Player) {
    player.deckSystem.tryPlay(player, 'PlayerBoard', this.payload.card2play);
  }
}
