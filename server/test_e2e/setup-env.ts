// Setup environment for e2e tests
process.env.NODE_ENV = 'test';

if (typeof (globalThis as any).Headers === 'undefined') {
  (globalThis as any).Headers = class Headers {
    private map = new Map<string, string>();
    constructor(init?: any) {
      if (init) {
        if (Array.isArray(init)) {
          init.forEach(([k, v]) => this.map.set(k.toLowerCase(), v));
        } else if (typeof init === 'object') {
          Object.entries(init).forEach(([k, v]) => this.map.set(k.toLowerCase(), String(v)));
        }
      }
    }
    append(k: string, v: string) { this.map.set(k.toLowerCase(), v); }
    delete(k: string) { this.map.delete(k.toLowerCase()); }
    get(k: string) { return this.map.get(k.toLowerCase()) || null; }
    has(k: string) { return this.map.has(k.toLowerCase()); }
    set(k: string, v: string) { this.map.set(k.toLowerCase(), v); }
    forEach(cb: any) { this.map.forEach(cb); }
  };
}

if (typeof (globalThis as any).WebSocket === 'undefined') {
  (globalThis as any).WebSocket = class {};
}
