import City from "./City";
import { Room as RoomType } from '../types/constants';
import store from '../stores/MemoryStore'

interface Room {
  id: string;
  city: City;
  cuisines: number[];
  users?: string[];
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
}

export default Room;
