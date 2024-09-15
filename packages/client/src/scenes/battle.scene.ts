import {
  Actor,
  Engine,
  PointerEvent,
  Rectangle,
  Scene,
  TileMap,
  Vector
} from 'excalibur';
import {
  DEBUG,
  HEIGHT,
  MAP_COLS,
  MAP_ROWS,
  SESSION_BLUEPRINT,
  TEAM_1_DEPLOY_ZONE_COLOR,
  TEAM_2_DEPLOY_ZONE_COLOR,
  TILE_SIZE,
  WIDTH
} from '../constants';
import { mapSheet } from '../resources';
import { Player } from '@/entities/player/player';
import { GameSession } from '@/entities/game-session';
import { GameCoords } from '@/utils/game-coords';
import { pointRectCollision, rectRectCollision } from '@game/shared';
import { UnitBlueprint } from '@/entities/unit/unit.entity';

export type GameState = {
  players: Player[];
};

export class BattleScene extends Scene {
  private session = new GameSession(SESSION_BLUEPRINT);

  onInitialize(engine: Engine): void {
    this.setupCamera();
    this.setupMap();
    this.addActors();

    engine.input.pointers.primary.on('up', this.handleClick.bind(this));
  }

  // temporary method to get the players we're controlling
  get myPlayer() {
    return this.session.teams[0].getPlayerById('player1')!;
  }

  private handleClick(e: PointerEvent) {
    const gameCoords = GameCoords.fromScreenCoords(e.screenPos);
    const isInDeployZone = pointRectCollision(
      gameCoords.coords,
      this.session.teams[0].deployZone
    );
    if (!isInDeployZone) return;

    const blueprint: UnitBlueprint = {
      attack: 5,
      health: 30,
      range: TILE_SIZE,
      spawnTime: 1000,
      speed: 10,
      size: { width: 0.5, height: 0.5 }
    };

    const unit = this.myPlayer.deployUnit(
      gameCoords.coords.x,
      gameCoords.coords.y,
      blueprint
    );

    this.add(unit);
  }

  private setupCamera() {
    this.camera.zoom = 2;
    this.camera.move(new Vector(WIDTH / 2, HEIGHT / 2), 0);
  }

  private setupMap() {
    const tilemap = new TileMap({
      rows: MAP_ROWS,
      columns: MAP_COLS,
      tileWidth: 32,
      tileHeight: 32
    });

    tilemap.tiles.forEach((tile, index) => {
      const [x, y] = this.session.map[index];
      const sprite = mapSheet.getSprite(x, y);
      tile.addGraphic(sprite);
    });

    this.add(tilemap);
  }

  addActors() {
    this.session.teams.forEach((team, index) => {
      if (DEBUG) {
        const rect = new Rectangle({
          width: team.deployZone.width * TILE_SIZE,
          height: team.deployZone.height * TILE_SIZE,
          color: index === 0 ? TEAM_1_DEPLOY_ZONE_COLOR : TEAM_2_DEPLOY_ZONE_COLOR
        });

        const actor = new Actor({
          x: team.deployZone.x * TILE_SIZE,
          y: team.deployZone.y * TILE_SIZE,
          anchor: new Vector(0, 0)
        });
        actor.graphics.use(rect);
        this.add(actor);
      }

      team.players.forEach(player => {
        player.towers.forEach(tower => {
          this.add(tower);
        });
      });
    });
  }
}
