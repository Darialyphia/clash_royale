import './style.css';
import { BG_COLOR, HEIGHT, MAP_COLS, MAP_ROWS, WIDTH } from './constants';
import {
  Color,
  DisplayMode,
  Engine,
  FadeInOut,
  Rectangle,
  TileMap
} from 'excalibur';
import { loader, mapSheet } from './resources';
import { BattleScene } from './scenes/battle.scene';

const game = new Engine({
  width: WIDTH * 2,
  height: HEIGHT * 2,
  pixelArt: true,
  antialiasing: {
    canvasImageRendering: 'pixelated'
  },
  scenes: {
    battle: BattleScene
  }
});

game.start('battle', {
  inTransition: new FadeInOut({
    direction: 'in',
    color: BG_COLOR,
    duration: 1000
  }),
  loader
});
