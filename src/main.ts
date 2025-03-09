import './style.css'
import Phaser from 'phaser'
import { PreloadScene } from './scenes/preload-scene'
import { Titlescene } from './scenes/title-scene'
import { GameScene } from './scenes/gameboard-scene'
import { ShopScene } from './scenes/shop-scene'
import { sizes } from './scenes/common'

const game_canvas = document.getElementById('gameCanvas') as HTMLCanvasElement

const game_config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    pixelArt: true,
    canvas: game_canvas,
    scene: [PreloadScene, Titlescene, GameScene, ShopScene]
}

window.onload = () => {
    new Phaser.Game(game_config)
}