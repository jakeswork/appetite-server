export type ZomatoCityResponse = {
  location_suggestions: ZomatoCityData[];
}

export type ZomatoCityData = {
  id: number;
  name: string;
  country_id?: number;
  country_name?: string;
  is_state?: boolean;
  state_id?: number;
  state_name?: string;
  state_code?: string;
}

export type ZomatoRestaurantResponse = {
  results_found?: number;
  results_start?: number;
  results_shown?: number;
  restaurants?: ZomatoRestaurant[];
}

type ZomatoRestaurant = {
  restaurant: ZomatoRestaurantData
}

export type ZomatoRestaurantData = {
  id?: number;
  name?: string;
  url?: string;
  location?: ZomatoRestaurantLocation;
  average_cost_for_two?: number;
  price_range?: number
  currency?: string;
  thumb?: string;
  user_rating?: ZomatoUserRating;
  featured_image?: string;
  photos_url?: string;
  menu_url?: string;
  events_url?: string;
  has_online_delivery?: boolean;
  is_delivering_now?: boolean;
  has_table_booking?: boolean;
  deeplink?: string;
  cuisines?: string;
  all_reviews_count?: number;
  highlights?: string[];
  phone_numbers?: string;
  timings?: string;
  R: ZomatoRestaurantRealtimeInformation;
}

type ZomatoRestaurantRealtimeInformation = {
  has_menu_status?: ZomatoRestaurantOptions
  is_grocery_store?: boolean;
  res_id?: number;
}

type ZomatoRestaurantOptions = {
  delivery?: boolean;
  takeaway?: boolean;
}

export type ZomatoRestaurantLocation = {
  address?: string;
  locality?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  zipcode?: string;
  country_id?: number;
}

export type ZomatoUserRating = {
  aggregate_rating?: number;
  rating_text?: string;
  rating_color?: string;
  votes?: number;
}

export enum ZomatoSearchEntities {
  CITY = 'city',
  SUBZONE = 'subzone',
  ZONE = 'zone',
  LANDMARK = 'landmark',
  METRO = 'metro',
  GROUP = 'group'
}

export type ZomatoCuisinesResponse = {
  cuisines: ZomatoCuisine[]
}

type ZomatoCuisine = {
  cuisine: ZomatoCuisineData
}

export type ZomatoCuisineData = {
  cuisine_id: number;
  cuisine_name: string;
}
