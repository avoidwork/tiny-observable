export function observable(arg?: number, id?: () => string): Observable;
export class Observable {
    constructor(arg?: number, id?: () => string);
    id: () => string;
    limit: number;
    listeners: any;
    hooks: any;
    addListener(ev?: string, handler?: () => any, id?: string, scope?: this): this;
    dispatch(ev?: string, ...args: any[]): this;
    emit(ev?: string, ...args: any[]): this;
    eventNames(): any;
    getMaxListeners(): number;
    listenerCount(ev?: string): any;
    hook(target?: any, ev?: string): this;
    off(ev?: string, id?: string): this;
    on(ev?: string, handler?: () => any, id?: string, scope?: this): this;
    once(ev?: string, handler?: () => any, id?: string, scope?: this): this;
    rawListeners(ev?: string): any;
    removeAllListeners(ev?: string): this;
    removeListener(ev?: string, id?: string): this;
    setMaxListeners(arg?: number): this;
    unhook(target?: any, ev?: string): this;
}
