import type { Serializable, StrictOmit } from '@game/shared';
import { Team, type TeamBlueprint } from './team/team';
import { nanoid } from 'nanoid';
import { config } from './config';
import { TypedEventEmitter } from './utils/typed-emitter';

export type SerializedGameSession = {
  foo: boolean;
};

export type GameSessionBlueprint = {
  teams: [StrictOmit<TeamBlueprint, 'id'>, StrictOmit<TeamBlueprint, 'id'>];
  map: [number, number][];
};

const GAME_SESSION_EVENTS = {
  UPDATE: 'update'
} as const;

export type GameSessionEvents = {
  [GAME_SESSION_EVENTS.UPDATE]: [SerializedGameSession];
};

export type GameSessionSubscriber = (session: SerializedGameSession) => void;

export class GameSession implements Serializable {
  teams: [Team, Team];

  map: Array<[number, number]>;

  private emitter = new TypedEventEmitter<GameSessionEvents>();

  private isRunning = false;

  private interval: ReturnType<typeof setInterval> | null = null;

  private lastTickTimestamp = 0;

  constructor(options: GameSessionBlueprint) {
    this.map = options.map;
    this.teams = options.teams.map(team => {
      return new Team(this, {
        id: nanoid(6),
        deployZone: team.deployZone,
        players: team.players
      });
    }) as [Team, Team];
  }

  private tick() {
    this.update();
    this.emitter.emit(GAME_SESSION_EVENTS.UPDATE, this.serialize());
  }

  private update() {
    const now = performance.now();
    const delta = Math.max(0, now - this.lastTickTimestamp);
    console.log('TODO: process inputs and update entities / systems');
    this.lastTickTimestamp = now;
  }

  serialize(): SerializedGameSession {
    return { foo: true };
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTickTimestamp = performance.now();
    this.interval = setInterval(this.tick.bind(this), 1000 / config.TICKS_PER_SECOND);
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.interval!);
    this.interval = null;
  }

  subscribe(cb: GameSessionSubscriber) {
    return this.emitter.on(GAME_SESSION_EVENTS.UPDATE, cb);
  }
}
