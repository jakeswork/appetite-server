import { ZomatoCuisinesResponse, ZomatoCuisineData } from '../types/zomato';
import Zomato from './Zomato';

interface Cuisine {
  id: number;
  name: string;
}

class Cuisine {
  constructor(props: ZomatoCuisineData) {
    this.id = props.cuisine_id;
    this.name = props.cuisine_name;
  }

  static async findManyByCityId (cityId: string): Promise<Cuisine[]> {
    const { data } = await Zomato.get<ZomatoCuisinesResponse>('cuisines', {
      city_id: cityId
    })

    if (!data) return []

    return data.cuisines.map(({ cuisine }) => new Cuisine(cuisine))
  }
}

export default Cuisine;
