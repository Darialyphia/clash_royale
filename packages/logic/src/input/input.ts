import { z } from 'zod';
import type { JSONValue } from '@game/shared';
import type { GameSession } from '../game-session';
import type { Player } from '../player/player.entity';

export const defaultInputSchema = z.object({
  playerId: z.string()
});
export type DefaultSchema = typeof defaultInputSchema;

export type SerializedInput = {
  type: string;
  payload: JSONValue;
};

export type AnyGameAction = Input<any>;

export abstract class Input<TSchema extends DefaultSchema> {
  abstract readonly name: string;
  protected abstract payloadSchema: TSchema;

  protected payload!: z.infer<TSchema>;

  constructor(protected rawPayload: JSONValue) {}

  protected abstract impl(session: GameSession, player: Player): void;

  private parsePayload() {
    const parsed = this.payloadSchema.safeParse(this.rawPayload);
    if (!parsed.success) {
      return this.printError('Wrong action payload');
    }

    this.payload = parsed.data;
  }

  async execute(session: GameSession) {
    this.parsePayload();
    if (!this.payload) return;

    const player = this.getPlayer(session);
    if (!player) return;

    this.impl(session, player);
  }

  protected printError(message: string) {
    console.log(`%c[${this.name}]`, 'color: red', message);
  }

  getPlayer(session: GameSession) {
    const player = session.teams
      .map(team => [...team.players.values()])
      .flat()
      .find(player => player.id === this.payload.playerId);

    if (!player) {
      return this.printError(`player not found: ${this.payload.playerId}`);
    }

    return player;
  }
}
