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

        const click_to_start = this.add.image(this.scale.width / 2, 700, "click_to_start")

        this.tweens.add({
            targets: click_to_start,
            alpha: {
                start: 1,
                from: 1,
                to: 0,
            },
            duration: 1500,
            repeat: -1,
        })
        this.input.once(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.start(scene_keys.gameboard)
        })
    }
}