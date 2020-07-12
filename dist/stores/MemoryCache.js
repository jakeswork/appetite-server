"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MemoryCache {
    constructor(
    /** Time until cache is cleared in minutes. */
    ttl) {
        this.store = new Map();
        if (ttl) {
            setTimeout(() => {
                this.flushAll();
            }, this.getExpirationFromOpts(ttl));
        }
    }
    flush(key) {
        return this.store.delete(key);
    }
    flushAll() {
        this.store = new Map();
        return this.store;
    }
    set(keyIdentifier, value, 
    /** Time until cache is cleared in minutes. */
    ttl) {
        const key = this.buildStringFromKeyIdentifier(keyIdentifier);
        if (ttl) {
            setTimeout(() => {
                this.flush(key);
            }, this.getExpirationFromOpts(ttl));
        }
        return this.store.set(key, value).get(key);
    }
    get(keyIdentifier) {
        const key = this.buildStringFromKeyIdentifier(keyIdentifier);
        if (!this.store.has(key))
            return null;
        return this.store.get(key);
    }
    has(keyIdentifier) {
        const key = this.buildStringFromKeyIdentifier(keyIdentifier);
        return this.store.has(key);
    }
    buildStringFromKeyIdentifier(keyIdentifier) {
        const keys = keyIdentifier.params
            ? Object.keys(keyIdentifier.params).join()
            : '';
        const values = keyIdentifier.params
            ? Object.values(keyIdentifier.params).map(v => v.toString()).join()
            : '';
        return `${keyIdentifier.endpoint}-${keys}-${values}`;
    }
    getExpirationFromOpts(opts) {
        const hours = opts.hours ? opts.hours * 3.6e+6 : 0;
        const minutes = opts.minutes ? opts.minutes * 60000 : 0;
        return hours + minutes;
    }
}
exports.default = MemoryCache;
//# sourceMappingURL=MemoryCache.js.map