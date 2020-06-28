import { ZomatoGetParams } from '../models/Zomato';

interface MemoryCache<T> {
  store: Map<string, T>
}

type KeyIdentifier = {
  endpoint: string;
  params?: ZomatoGetParams
}

type ExpirationOpts = {
  hours?: number;
  minutes?: number;
}

class MemoryCache<T> {
  constructor (
    /** Time until cache is cleared in minutes. */
    ttl?: ExpirationOpts
  ) {
    this.store = new Map()

    if (ttl) {
      setTimeout(() => {
        this.flushAll()
      }, this.getExpirationFromOpts(ttl))
    }
  }

  flush (key: string): boolean {
    return this.store.delete(key)
  }

  flushAll (): Map<string, T> {
    this.store = new Map()

    return this.store
  }

  set (
    keyIdentifier: KeyIdentifier,
    value: T,
    /** Time until cache is cleared in minutes. */
    ttl?: ExpirationOpts
  ): T {
    const key = this.buildStringFromKeyIdentifier(keyIdentifier);

    if (ttl) {
      setTimeout(() => {
        this.flush(key)
      }, this.getExpirationFromOpts(ttl))
    }

    return this.store.set(key, value).get(key)
  }

  get (keyIdentifier: KeyIdentifier): T | null {
    const key = this.buildStringFromKeyIdentifier(keyIdentifier);

    if (!this.store.has(key)) return null;

    return this.store.get(key)
  }

  has (keyIdentifier: KeyIdentifier): boolean {
    const key = this.buildStringFromKeyIdentifier(keyIdentifier);

    return this.store.has(key)
  }

  buildStringFromKeyIdentifier (keyIdentifier: KeyIdentifier): string {
    const keys = keyIdentifier.params
      ? Object.keys(keyIdentifier.params).join()
      : ''
    const values = keyIdentifier.params
      ? Object.values(keyIdentifier.params).map(v => v.toString()).join()
      : ''

    return `${keyIdentifier.endpoint}-${keys}-${values}`
  }

  getExpirationFromOpts (opts: ExpirationOpts): number {
    const hours = opts.hours ? opts.hours * 3.6e+6 : 0
    const minutes = opts.minutes ? opts.minutes * 60000 : 0

    return hours + minutes;
  }
}

export default MemoryCache;
