import { Game, type GameAttributes, Actor, Trait, Scene, Director, Signal, Dispatch } from "../src/index.js"


import r from "raylib";

interface TestInterface extends GameAttributes {}

export class Test extends Game {
    public player: Actor | null = null;

    constructor(attributes: TestInterface) {
        super(attributes);
    }

    public override onStart(): void {

    }
}

const test: Test = new Test({ parent: null, name: "Test" });
test.start();