import Phaser from "phaser"
import { scene_keys, sizes } from "./common"


export class Titlescene extends Phaser.Scene {
    constructor() {
        super({ key: scene_keys.title })
    }

    create(): void {
        const bg = this.add.image(0, 0, "title_bg").setOrigin(0, 0)
        bg.setDisplaySize(sizes.width, sizes.height)
        const txt = this.add.image(sizes.width / 2, 300, "title_text")
        txt.setScale(0.6)

        bg.setInteractive()
        bg.on("pointerdown", () => this.scene.start(scene_keys.gameboard))
    }
}