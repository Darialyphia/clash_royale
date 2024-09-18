import type { StrictOmit } from '@game/shared';
import { Team, type SerializedTeam, type TeamBlueprint } from './team/team.entity';
import { nanoid } from 'nanoid';
import { config } from './config';
import { TypedEventEmitter } from './utils/typed-emitter';
import { Board, type BoardBlueprint, type SerializedBoard } from './board/board.entity';
import type { SerializedTower } from './tower/tower.entity';
import type { SerializedUnit } from './unit/unit.entity';
import { InputSystem } from './input/input-system';
import type { SerializedInput } from './input/input';
import type { PlayerBlueprint } from './player/player.entity';

export type SerializedGameStateSnapshot = {
  state: {
    teams: [
      StrictOmit<SerializedTeam, 'towers' | 'units'>,
      StrictOmit<SerializedTeam, 'towers' | 'units'>
    ];
    towers: SerializedTower[];
    units: SerializedUnit[];
  };
  events: any[]; // @TODO: define how we represent events that happened during a tick so that the client can triggers things like sounds, VFX...
};

export type SerializedInitialState = {
  teams: [SerializedTeam, SerializedTeam];
  board: SerializedBoard;
};

export type GameSessionBlueprint = {
  teams: [StrictOmit<TeamBlueprint, 'id'>, StrictOmit<TeamBlueprint, 'id'>];
  board: StrictOmit<BoardBlueprint, 'id'>;
};

const GAME_SESSION_EVENTS = {
  UPDATE: 'update'
} as const;

export type GameSessionEvents = {
  [GAME_SESSION_EVENTS.UPDATE]: [SerializedGameStateSnapshot];
};

export type GameSessionSubscriber = (session: SerializedGameStateSnapshot) => void;

export class GameSession {
  teams: [Team, Team];

  board: Board;

  private emitter = new TypedEventEmitter<GameSessionEvents>();

  private isRunning = false;

  private interval: ReturnType<typeof setInterval> | null = null;

  private lastTickTimestamp = 0;

  private inputSystem = new InputSystem();

  constructor(options: GameSessionBlueprint) {
    this.board = new Board(this, { ...options.board, id: nanoid(6) });
    this.teams = options.teams.map(team => {
      return new Team(this, {
        id: nanoid(6),
        deployZone: team.deployZone,
        players: team.players
      });
    }) as [Team, Team];
  }

  private tick() {
    this.processInputs();
    this.update();
    this.emitter.emit(GAME_SESSION_EVENTS.UPDATE, this.serializeGameState());
  }

  private processInputs() {
    this.inputSystem.process(this);
  }

  private update() {
    const now = performance.now();
    const delta = Math.max(0, now - this.lastTickTimestamp);

    this.teams.forEach(team => {
      team.update(delta);
    });

    this.lastTickTimestamp = now;
  }

  private serializeGameState(): SerializedGameStateSnapshot {
    const {
      towers: team1Towers,
      units: team1Units,
      ...team1
    } = this.teams[0].serialize();
    const {
      towers: team2Towers,
      units: team2Units,
      ...team2
    } = this.teams[1].serialize();

    return {
      state: {
        teams: [team1, team2],
        towers: [...team1Towers, ...team2Towers],
        units: [...team1Units, ...team2Units]
      },
      events: []
    };
  }

  getInitialState(): SerializedInitialState {
    return {
      teams: [this.teams[0].serialize(), this.teams[1].serialize()],
      board: this.board.serialize()
    };
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

  dispatch(input: SerializedInput) {
    this.inputSystem.dispatch(input);
  }

  subscribe(cb: GameSessionSubscriber) {
    return this.emitter.on(GAME_SESSION_EVENTS.UPDATE, cb);
  }
}
