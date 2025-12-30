import { Module, type ModuleAttributes } from "../module.js";
import { Signal } from "./other/signal.js";

interface DispatchAttributes extends ModuleAttributes {}

export class Dispatch extends Module {
    public signals: Record<string, Signal>;
    [key: string]: any;

    constructor(attributes: DispatchAttributes) {
        super(attributes);
        this.signals = {};

        return new Proxy(this, {
            get: (target, prop: string | symbol) => {
                if (prop in target) return (target as any)[prop];

                if (typeof prop === "string") {
                    const signal = target.getFromSignals(prop);
                    if (signal) return signal;
                }
                return undefined;
            }
        });
    }

    public getFromSignals(target: string): Signal | undefined {
        if (this.signals[target]) return this.signals[target];

        for (const key in this.signals) {
            const signal = this.signals[key];
            if (signal && (signal.id === target || signal.name === target)) {
                return signal;
            }
        }
        return undefined;
    }

    public addToSignals(signal: Signal): void {
        const exists = Object.values(this.signals).some(
            s => s === signal || s.id === signal.id
        );

        if (!exists) {
            this.signals[signal.name] = signal;
        }
    }

    public removeFromSignals(target: Signal | string): void {
        const id = typeof target === "string" ? target : target.id;
        
        if (typeof target === "string" && this.signals[target]) {
            delete this.signals[target];
            return;
        }

        for (const key in this.signals) {
            const signal = this.signals[key];
            if (signal && (signal.id === id || signal.name === id)) {
                delete this.signals[key];
                break;
            }
        }
    }

    public override start(): void {
        this.enabled = true;
    }
}