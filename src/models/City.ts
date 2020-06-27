import Zomato from './Zomato';
import { ZomatoCityData, ZomatoCityResponse } from '../types/zomato';

interface City {
  id: number;
  name: string;
  area: string;
}

class City {
  constructor(props: ZomatoCityData) {
    this.id = props.id;
    this.name = `${props.name}, ${props.state_name}`
    this.area = props.country_name
  }

  static async findManyByQuery (query: string): Promise<City[]> {
    const { data } = await Zomato.get<ZomatoCityResponse>('cities', { q: query })

    if (!data) return []

    return data.location_suggestions.map(l => new City(l))
  }
}

export default City;
