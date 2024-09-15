import { Scene, TileMap, Vector } from 'excalibur';
import { HEIGHT, MAP_COLS, MAP_ROWS, SESSION_BLUEPRINT, WIDTH } from '../constants';
import { mapSheet } from '../resources';
import { Player } from '@/entities/player/player';
import { GameSession } from '@/entities/game-session';

export type GameState = {
  players: Player[];
};

export class BattleScene extends Scene {
  private session!: GameSession;

  onInitialize(): void {
    this.setupSession();
    this.setupCamera();
    this.setupMap();
    this.render();
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

  setupSession() {
    this.session = new GameSession(SESSION_BLUEPRINT);
  }

  render() {
    this.session.teams.forEach(team => {
      team.players.forEach(player => {
        player.towers.forEach(tower => {
          this.add(tower);
        });
      });
    });
  }
}
