import { Module, type ModuleAttributes } from "../module.js";
import { Window } from "./other/window.js";
import type { Loop } from "../loop/loop.js";

import r from "raylib"

interface RendererAttributes extends ModuleAttributes {}

export class Renderer extends Module {
    window: Window;
    constructor(attributes: RendererAttributes) {
        super(attributes)
        this.window = new Window({parent:this, title:this.parent.name})
    }
    
    public override render(): void {
        if (this.enabled) {
            r.BeginDrawing();
            r.ClearBackground(r.RAYWHITE);
            const loop = this.parent.modules.loop;
            if (loop) {
                for (const layer of loop.queue) {
                    for (const module of layer) {
                        if (module !== this) {
                            module.render?.();
                        }
                    }
                }
            }
            r.EndDrawing();
        }
    }

    public override start(): void {
        if (!this.enabled) {
            const loop: Loop = this.parent.modules.loop
            if (loop) {
                loop.addToQueue(this, 0)
            }
            this.window.open()
            this.enabled = true
        }
    }
}