import './style.css';
import { BG_COLOR, HEIGHT, WIDTH } from './constants';
import { Engine, FadeInOut } from 'excalibur';
import { loader } from './resources';
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
