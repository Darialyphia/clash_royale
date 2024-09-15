import { Rectangle } from '@game/shared';
import { Player, PlayerBlueprint } from '../player/player';
import { GameSession } from '../game-session';
import { Entity, EntityId } from '../_entity';

export type TeamBluprint = {
  id: EntityId;
  deployZone: Rectangle;
  players: PlayerBlueprint[];
};

export class Team extends Entity {
  private readonly session: GameSession;

  readonly players: Set<Player>;

  readonly deployZone: Rectangle;

  constructor(session: GameSession, blueprint: TeamBluprint) {
    super(blueprint.id);
    this.session = session;
    this.players = new Set(blueprint.players.map(p => new Player(this.session, p)));
    this.deployZone = blueprint.deployZone;
  }

  opponents() {
    return this.session.teams.find;
  }
}
