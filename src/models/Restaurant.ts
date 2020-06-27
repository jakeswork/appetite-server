import { ZomatoRestaurantData, ZomatoRestaurantResponse, ZomatoSearchEntities } from '../types/zomato';
import Zomato from './Zomato';

interface Restaurant {
  id: number;
  name: string;
  address?: string,
  averageCostForTwo?: number;
  priceRange?: number;
  image?: string;
  thumbnail?: string;
  menuUrl?: string;
  hasOnlineDelivery?: boolean;
  hasTableBooking?: boolean;
  url?: string;
  cuisines?: string;
  highlights?: string[];
  phoneNumbers?: string;
  openHours?: string;
  deliveryOpen?: boolean;
  takeawayOpen?: boolean;
  totalReviews?: number;
  averageRating?: number;
}

interface RestaurantMetaData {
  totalResults: number;
  resultsShown: number;
}

interface RestaurantListWithMetaData {
  metadata: RestaurantMetaData;
  restaurants: Restaurant[];
}

class Restaurant {
  constructor(props: ZomatoRestaurantData) {
    this.id = props.id;
    this.name = props.name;
    this.address = props.location?.address;
    this.averageCostForTwo = props.average_cost_for_two;
    this.priceRange = props.price_range;
    this.image = props.featured_image;
    this.thumbnail = props.thumb;
    this.menuUrl = props.menu_url;
    this.hasOnlineDelivery = props.has_online_delivery;
    this.hasTableBooking = props.has_table_booking;
    this.url = props.url;
    this.cuisines = props.cuisines;
    this.highlights = props.highlights;
    this.phoneNumbers = props.phone_numbers;
    this.openHours = props.timings;
    this.deliveryOpen = props.R?.has_menu_status?.delivery;
    this.takeawayOpen = props.R?.has_menu_status?.takeaway;
    this.totalReviews = props.all_reviews_count;
    this.averageRating = props.user_rating?.aggregate_rating
  }

  static async findManyByCityId (cityId: string, cuisines: string): Promise<RestaurantListWithMetaData> {
    const { data } = await Zomato.get<ZomatoRestaurantResponse>('search', {
      entity_id: cityId,
      entity_type: ZomatoSearchEntities.CITY,
      cuisines
    })

    if (!data) return null

    return Restaurant.decorateWithMetaData(data)
  }

  static decorateWithMetaData (data: ZomatoRestaurantResponse): RestaurantListWithMetaData {
    return {
      metadata: {
        totalResults: data.results_found,
        resultsShown: data.results_shown,
      },
      restaurants: data.restaurants.map(({ restaurant }) => new Restaurant(restaurant))
    }
  }
}

export default Restaurant
