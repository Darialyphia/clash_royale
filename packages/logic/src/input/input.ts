import { z } from 'zod';
import type { JSONValue } from '@game/shared';
import type { GameSession } from '../game-session';

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

  protected abstract impl(session: GameSession): void;

  private parsePayload() {
    const parsed = this.payloadSchema.safeParse(this.rawPayload);
    if (!parsed.success) {
      return this.printError('Wrong action payload');
    }

    this.payload = parsed.data;
  }

  async execute(session: GameSession) {
    this.parsePayload();
    this.impl(session);
  }

  protected printError(message: string) {
    console.log(`%c[${this.name}]`, 'color: red', message);
  }
}
