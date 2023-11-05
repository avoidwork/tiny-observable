export function observable(arg?: number, id?: () => `${string}-${string}-${string}-${string}-${string}`): Observable;
export class Observable {
    constructor(arg?: number);
    limit: number;
    listeners: any;
    hooks: any;
    addListener(ev?: string, handler?: () => any, id?: any, scope?: this): this;
    dispatch(ev?: string, ...args: any[]): this;
    emit(ev?: string, ...args: any[]): this;
    eventNames(): any;
    getMaxListeners(): number;
    hook(target?: any, ev?: string): this;
    id(): any;
    listenerCount(ev?: string): any;
    off(ev?: string, id?: string): this;
    on(ev?: string, handler?: () => any, id?: any, scope?: this): this;
    once(ev?: string, handler?: () => any, id?: any, scope?: this): this;
    rawListeners(ev?: string): any;
    removeAllListeners(ev?: string): this;
    removeListener(ev?: string, id?: string): this;
    setMaxListeners(arg?: number): this;
    unhook(target?: any, ev?: string): this;
}
