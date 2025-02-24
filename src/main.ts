import './style.css'
import Phaser from 'phaser'

const sizes = {
    width: 900,
    height: 600
}

class GameScene extends Phaser.Scene{
    constructor(){
        super("scene-game")
    }

    preload(){
        this.load.image("bg", "/assets/bg.jpg")
        this.load.image("all", "/assets/playing_cards/All.png")
    }

    create(){
        this.add.image(0, 0, "bg").setOrigin(0, 0)
        this.add.image(800, 500, "all").setOrigin(0, 0)
    }

    update(){}
}

const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

const config = {
    type:Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    canvas: gameCanvas,
    scene:[GameScene]
}

const game = new Phaser.Game(config)