import City from "./City";
import { Room as RoomType, Message } from '../types/constants';
import store from '../stores/MemoryStore'
import User from './User';
import { mostCommonEntries } from '../utils';
import Restaurant from "./Restaurant";

interface Room {
  id: string;
  city: City;
  cuisines: number[];
  users?: string[];
  messages: Message[];
}

type VoteResults = {
  mostCommonRestaurants: Restaurant[];
  mostCommonCuisines: string[];
}

class Room {
  constructor (props: RoomType) {
    Object.assign(this, props)
  }

  static create (room: RoomType): Room | null{
    const roomId = `R_${room.id}`
    const alreadyExists = Room.findById(roomId)

    if (alreadyExists) return null;

    const withDefaults: RoomType = {
      ...room,
      id: roomId,
      users: [],
      messages: [],
    }

    store.insertRoom(withDefaults)

    return new Room(withDefaults)
  }

  static findById (roomId: string): Room | null {
    const room = store.findRoomById(roomId)

    if (!room) return null

    return new Room(room)
  }

  addUser (userId: string): Room | null {
    const index = this.users.indexOf(userId)

    if (index > -1) return null;

    this.users.push(userId)

    store.upsertRoom(this)

    return this;
  }

  removeUser (userId: string): Room | null {
    const usersWithoutId = this.users.filter(u => u !== userId);

    this.users = usersWithoutId

    store.upsertRoom(this)

    return this;
  }

  addMessage (message: Message): Room {
    this.messages.push(message)

    store.upsertRoom(this)

    return;
  }
 
  async getVoteResults (): Promise<VoteResults> | null {
    if (!this.users || !this.users.length) return null;

    const users = this.users.map(userId => User.findById(userId)).filter(u => u)
    const allUsersHaveVoted = users.every(u => u.vote.hasConfirmedSelection)

    if (!allUsersHaveVoted) return null;

    const usersSelections = [].concat(...users.map(({ vote }) => vote.selection))
    const restaurants = usersSelections.map(({ id }) => id)
    const cuisines = [].concat(...usersSelections.map(({ cuisines }) => cuisines.split(', ')))
    const mostCommonRestaurants = mostCommonEntries(restaurants)
    const mostCommonCuisines = mostCommonEntries(cuisines);
    const resolvedRestaurants = await Promise.all(mostCommonRestaurants.map(id => Restaurant.findById(id)))

    return {
      mostCommonRestaurants: resolvedRestaurants,
      mostCommonCuisines,
    }
  }
}

export default Room;
