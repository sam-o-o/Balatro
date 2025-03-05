import Phaser from 'phaser'
import { scene_keys, sizes} from './common'

export class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: scene_keys.shop })
    }

    create() {
        const bg = this.add.image(0, 0, "bg").setOrigin(0, 0)
        bg.setDisplaySize(sizes.width, sizes.height)
        bg.setInteractive()
        bg.on("pointerdown", () => {
            this.scene.start(scene_keys.gameboard)
        })
    }       
}