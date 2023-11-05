export function observable(arg?: number, id?: () => string): Observable;
export class Observable {
    constructor(arg?: number, id?: () => string);
    id: () => string;
    limit: number;
    listeners: any;
    hooks: any;
    dispatch(ev?: string, ...args: any[]): this;
    hook(target?: any, ev?: string): this;
    off(ev?: string, id?: string): this;
    on(ev?: string, handler?: () => any, id?: string, scope?: this): this;
    once(ev?: string, handler?: () => any, id?: string, scope?: this): this;
    setMaxListeners(arg?: number): this;
    unhook(target?: any, ev?: string): this;
}
