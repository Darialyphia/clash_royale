import { Engine, Scene, TileMap, Vector, type PointerEvent } from 'excalibur';
import { HEIGHT, MAP_COLS, MAP_ROWS, SESSION_BLUEPRINT, WIDTH } from '../constants';
import { mapSheet } from '../resources';
import { PlayerActor } from '@/actors/player/player';
import {
  GameSession,
  SerializedBoard,
  SerializedGameStateSnapshot,
  SerializedTeam,
  SerializedTower,
  SerializedUnit
} from '@game/logic';
import { TowerActor } from '@/actors/tower/tower';
import { UnitActor } from '@/actors/unit/unit';
import { toWorldVector } from '@/utils/game-coords';

export class BattleScene extends Scene {
  private session!: GameSession;

  private gameState!: SerializedGameStateSnapshot['state'];

  private towerActorsMap = new Map<string, TowerActor>();

  private unitActorsMap = new Map<string, UnitActor>();

  private playerActorsMap = new Map<string, PlayerActor>();

  override onInitialize(): void {
    this.session = new GameSession(SESSION_BLUEPRINT);
    this.setupCamera();
    this.setupMap(this.session.getInitialState().board);
    this.session.subscribe(({ state }) => {
      this.gameState = state;
      this.updateActors();
    });

    this.input.pointers.on('up', this.onPointerup.bind(this));
    this.session.start();
  }

  onPointerup(e: PointerEvent) {
    const coords = toWorldVector(e.worldPos);

    this.session.dispatch({
      type: 'test',
      payload: { playerId: this.myPlayer.id, x: coords.x, y: coords.y }
    });
  }
  // temporary method to get the players we're controlling
  get myPlayer() {
    return this.gameState.teams[0].players.find(p => p.id === 'player1')!;
  }

  private setupCamera() {
    this.camera.zoom = 2;
    this.camera.move(new Vector(WIDTH / 2, HEIGHT / 2), 0);
  }

  private setupMap(board: SerializedBoard) {
    const tilemap = new TileMap({
      rows: MAP_ROWS,
      columns: MAP_COLS,
      tileWidth: 32,
      tileHeight: 32
    });

    tilemap.tiles.forEach((tile, index) => {
      const {
        atlasCoords: [x, y]
      } = board.cells[index];
      const sprite = mapSheet.getSprite(x, y);
      tile.addGraphic(sprite);
    });

    this.add(tilemap);
  }

  onPreUpdate(engine: Engine, delta: number) {
    super.onPreUpdate(engine, delta);
  }

  private createOrUpdateTower(tower: SerializedTower) {
    if (!this.towerActorsMap.has(tower.id)) {
      const newTower = new TowerActor(tower);
      this.towerActorsMap.set(tower.id, newTower);
      this.add(newTower);
      return;
    }

    this.towerActorsMap.get(tower.id)!.onStateUpdate(tower);
  }

  private createOrUpdateUnit(unit: SerializedUnit) {
    if (!this.unitActorsMap.has(unit.id)) {
      const newUnit = new UnitActor(unit);
      this.unitActorsMap.set(unit.id, newUnit);
      this.add(newUnit);
      return;
    }

    this.unitActorsMap.get(unit.id)!.onStateUpdate(unit);
  }

  private createOrUpdatePlayer(
    player: SerializedTeam['players'][number],
    teamIndex: number
  ) {
    if (!this.playerActorsMap.has(player.id)) {
      const newPlayer = new PlayerActor({
        player,
        location: ['left', 'right'][teamIndex] as 'left' | 'right'
      });
      this.playerActorsMap.set(player.id, newPlayer);
      this.add(newPlayer);
      return;
    }

    this.playerActorsMap.get(player.id)!.onStateUpdate(player);
  }

  private updateActors() {
    this.updateTowers();
    this.updateUnits();
    this.updateTeams();
  }

  private updateTowers() {
    // add or create tower actors
    const towerIds = new Set<string>();
    this.gameState.towers.forEach(tower => {
      this.createOrUpdateTower(tower);
      towerIds.add(tower.id);
    });

    // delete towers that are not here anymore
    // later on we can handle this more gracefully, like playing a dying animations etc
    for (const [towerId, tower] of this.towerActorsMap.entries()) {
      if (!towerIds.has(towerId)) {
        tower.kill();
        this.towerActorsMap.delete(towerId);
      }
    }
  }

  private updateUnits() {
    // add or create unit actors
    const unitIds = new Set<string>();
    this.gameState.units.forEach(unit => {
      this.createOrUpdateUnit(unit);
      unitIds.add(unit.id);
    });

    // delete towers that are not here anymore
    // later on we can handle this more gracefully, like playing a dying animations etc
    for (const [unitId, unit] of this.unitActorsMap.entries()) {
      if (!unitIds.has(unitId)) {
        unit.kill();
        this.unitActorsMap.delete(unitId);
      }
    }
  }

  private updateTeams() {
    this.gameState.teams.forEach((team, index) => {
      this.createOrUpdatePlayer(team.players.values().next().value!, index);
    });
  }
}
