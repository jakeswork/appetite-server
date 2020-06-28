import { ZomatoCuisinesResponse, ZomatoCuisineData } from '../types/zomato';
import Zomato from './Zomato';
import MemoryCache from '../stores/MemoryCache';

interface Cuisine {
  id: number;
  name: string;
}

const cache = new MemoryCache<Cuisine[]>()

class Cuisine {
  constructor(props: ZomatoCuisineData) {
    this.id = props.cuisine_id;
    this.name = props.cuisine_name;
  }

  static async findManyByCityId (cityId: string): Promise<Cuisine[]> {
    const opts = {
      endpoint: 'cuisines',
      params: { city_id: cityId }
    };

    if (cache.has(opts)) return cache.get(opts)

    const { data } = await Zomato.get<ZomatoCuisinesResponse>(opts.endpoint, opts.params)

    if (!data) return []

    const cuisines = data.cuisines.map(({ cuisine }) => new Cuisine(cuisine))

    return cache.set(opts, cuisines, { hours: 1 })
  }
}

export default Cuisine;
