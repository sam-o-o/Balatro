import './style.css'
import Phaser from 'phaser'

const sizes = {
    width: 900,
    height: 600
}

const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

const config = {
    type:Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    canvas: gameCanvas
}

const game = new Phaser.Game(config)