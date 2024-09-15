import { Rectangle } from '@game/shared';
import { Player, PlayerBlueprint } from '../player/player';
import { GameSession } from '../game-session';
import { Entity, EntityId } from '../_entity';
import { Tower } from '../tower/tower';
import { Unit } from '../unit/unit.entity';

export type TeamBlueprint = {
  id: EntityId;
  deployZone: Rectangle;
  players: PlayerBlueprint[];
};

export class Team extends Entity {
  private readonly session: GameSession;

  readonly players: Set<Player>;

  private playerMap = new Map<EntityId, Player>();

  readonly deployZone: Rectangle;

  constructor(session: GameSession, blueprint: TeamBlueprint) {
    super(blueprint.id);
    this.session = session;
    this.players = new Set(blueprint.players.map(p => new Player(this.session, p)));
    this.deployZone = blueprint.deployZone;
    this.players.forEach(player => this.playerMap.set(player.id, player));
  }

  getPlayerById(id: EntityId) {
    return this.playerMap.get(id);
  }

  opponents() {
    return this.session.teams.find;
  }

  get towers() {
    const result: Tower[] = [];
    this.players.forEach(p => {
      result.push(...p.towers);
    });
    return result;
  }

  get units() {
    const result: Unit[] = [];
    this.players.forEach(p => {
      result.push(...p.units);
    });
    return result;
  }
}
