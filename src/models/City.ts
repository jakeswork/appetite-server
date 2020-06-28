import Zomato from './Zomato';
import MemoryCache from '../stores/MemoryCache';
import { ZomatoCityData, ZomatoCityResponse } from '../types/zomato';

interface City {
  id: number;
  name: string;
  area: string;
}

const cache = new MemoryCache<City[]>();

class City {
  constructor(props: ZomatoCityData) {
    this.id = props.id;
    this.name = `${props.name}, ${props.state_name}`
    this.area = props.country_name
  }

  static async findManyByQuery (query: string): Promise<City[]> {
    const opts = {
      endpoint: 'cities',
      params: { q: query }
    };

    if (cache.has(opts)) return cache.get(opts)

    const { data } = await Zomato.get<ZomatoCityResponse>(opts.endpoint, opts.params)

    if (!data) return []

    const cities = data.location_suggestions.map(l => new City(l))

    return cache.set(opts, cities, { hours: 1 })
  }
}

export default City;
