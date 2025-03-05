import Phaser from 'phaser'
import { scene_keys, sizes} from './common'
import { create_left_panel } from '../lib/balatro_functions'

export class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: scene_keys.shop })
    }

    create() {
        const bg = this.add.image(0, 0, "bg").setOrigin(0, 0)
        bg.setDisplaySize(sizes.width, sizes.height)
        
        create_left_panel(this)

        bg.setInteractive()
        bg.on("pointerdown", () => {
            this.scene.start(scene_keys.gameboard)
        })
    }       
}