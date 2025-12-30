import { Game, type GameAttributes } from "../src/core/modules/game/game.js";
import { Actor } from "../src/core/modules/director/other/actor.js";
import { Trait } from "../src/core/modules/director/other/trait.js";
import { Scene } from "../src/core/modules/director/other/scene.js";
import { Director } from "../src/core/modules/director/director.js";

import r from "raylib"

class MovementTrait extends Trait {
    public x: number = 400;
    public y: number = 300;

    public override update(dt: number): void {
        if (r.IsKeyDown(r.KEY_RIGHT)) this.x += 200 * dt;
        if (r.IsKeyDown(r.KEY_LEFT)) this.x -= 200 * dt;
        if (r.IsKeyDown(r.KEY_DOWN)) this.y += 200 * dt;
        if (r.IsKeyDown(r.KEY_UP)) this.y -= 200 * dt;
    }

    public override render(): void {
        r.DrawCircle(this.x, this.y, 50, r.MAROON);
        r.DrawCircleLines(this.x, this.y, 50, r.GOLD);
    }
}

interface TestInterface extends GameAttributes {}

export class Test extends Game {
    public player: Actor | null = null;

    constructor(attributes: TestInterface) {
        super(attributes);
    }

    public override onStart(): void {
        const director = this.modules.director as Director;

        const mainScene = new Scene({
            parent: director,
            name: "MainScene"
        });

        this.player = new Actor({
            parent: mainScene,
            name: "Player"
        });

        this.player.addToTraits(new MovementTrait({
            parent: this.player,
            name: "Movement"
        }));

        director.switchCurrentScene("MainScene");
    }

    public override onUpdate(dt: number): void {
        if (r.IsKeyPressed(r.KEY_ESCAPE)) {
            this.stop()
        }

        if (r.IsKeyPressed(r.KEY_SPACE)) {
            if (this.player) {
                const movement = this.player.getFromTraits<MovementTrait>("Movement");
                console.log((this.player as any).Movement.x);
            }
        }
    }
}

const test: Test = new Test({ parent: null, name: "RaylibTest" });
test.start();