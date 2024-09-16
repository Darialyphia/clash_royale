import { type Rectangle, type Serializable } from '@game/shared';
import { Player, type PlayerBlueprint, type SerializedPlayer } from '../player/player';
import { GameSession } from '../game-session';
import { Tower } from '../tower/tower';
import { Entity, type EntityId } from '../entity';

/**
 * The shape of the input used to create a team
 */
export type TeamBlueprint = {
  id: EntityId;
  deployZone: Rectangle;
  players: PlayerBlueprint[];
};

export type SerializedTeam = {
  players: SerializedPlayer[];
  deployZone: Rectangle;
};

export class Team extends Entity implements Serializable<SerializedTeam> {
  private readonly session: GameSession;

  readonly players: Set<Player>;

  private playerMap = new Map<EntityId, Player>();

  readonly deployZone: Rectangle;

  constructor(session: GameSession, blueprint: TeamBlueprint) {
    super(blueprint.id);
    this.session = session;
    this.players = new Set(blueprint.players.map(p => new Player(this.session, p, this)));
    this.deployZone = blueprint.deployZone;
    this.players.forEach(player => this.playerMap.set(player.id, player));
  }

  getPlayerById(id: EntityId) {
    return this.playerMap.get(id);
  }

  opponents() {
    return this.session.teams.find;
  }

  towers() {
    const result: Tower[] = [];
    this.players.forEach(p => {
      result.push(...p.towers);
    });
    return result;
  }

  // get units() {
  //   const result: Unit[] = [];
  //   this.players.forEach(p => {
  //     result.push(...p.units);
  //   });
  //   return result;
  // }

  serialize() {
    return {
      deployZone: this.deployZone,
      players: [...this.players].map(player => player.serialize())
    };
  }
}
