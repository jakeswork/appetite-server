import City from "../models/City"
import Cuisine from '../models/Cuisine';

export type FormattedMessage = {
  username: string;
  message: string;
  time: string;
}

export type User = {
  id: string;
  username?: string;
  room: Room;
}

export type Room = {
  id: string;
  city: City;
  cuisines: number[];
}
