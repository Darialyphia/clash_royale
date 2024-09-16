import { type Rectangle, type Serializable, type StrictOmit } from '@game/shared';
import { Player, type PlayerBlueprint, type SerializedPlayer } from '../player/player';
import { GameSession } from '../game-session';
import { Tower, type SerializedTower } from '../tower/tower';
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
  players: Array<StrictOmit<SerializedPlayer, 'towers'>>;
  deployZone: Rectangle;
  towers: SerializedTower[];
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

  update(delta: number) {
    this.players.forEach(player => {
      player.update(delta);
    });
  }

  serialize() {
    const result: SerializedTeam = {
      deployZone: this.deployZone,
      towers: [],
      players: []
    };

    for (const player of this.players) {
      const { towers, ...rest } = player.serialize();
      result.towers.push(...towers);
      result.players.push(rest);
    }

    return result;
  }
}
