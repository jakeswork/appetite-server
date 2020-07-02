import City from "../models/City"
import Restaurant from '../models/Restaurant';

export type FormattedMessage = {
  username: string;
  message: string;
  time: string;
}

export type User = {
  id: string;
  username?: string;
  room?: Room;
  vote?: UserVote;
}

export type UserVote = {
  hasConfirmedSelection: boolean;
  selection: Restaurant[];
}

export type Room = {
  id: string;
  city: City;
  cuisines: number[];
  users?: string[];
}
