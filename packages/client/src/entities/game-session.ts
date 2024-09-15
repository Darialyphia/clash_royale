import { StrictOmit } from '@game/shared';
import { Team, TeamBluprint } from './team/team';
import { nanoid } from 'nanoid';

export type GameSessionBlueprint = {
  teams: [StrictOmit<TeamBluprint, 'id'>, StrictOmit<TeamBluprint, 'id'>];
  map: [number, number][];
};

export class GameSession {
  teams: [Team, Team];
  map: Array<[number, number]>;

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
}
