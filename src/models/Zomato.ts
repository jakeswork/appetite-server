import axios, { AxiosResponse } from 'axios';

import { ZomatoSearchEntities } from '../types/zomato';

export interface ZomatoGetParams {
  entity_id?: string;
  entity_type?: ZomatoSearchEntities;
  q?: string;
  city_id?: string;
  cuisines?: string;
}

const ZOMATO_API_KEY = process.env.ZOMATO_API_KEY

class Zomato {
  static async get<T> (endpoint: string, params: ZomatoGetParams): Promise<AxiosResponse<T>> {
    try {
      const response = await axios.get(`https://developers.zomato.com/api/v2.1/${endpoint}`, {
        params,
        headers: {
          'user-key': ZOMATO_API_KEY
        }
      })

      return response
    } catch (error) {
      console.error(error)
    }
  }
}

export default Zomato
