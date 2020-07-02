import { Room, User } from '../types/constants';

interface MemoryStore {
  users: User[]
  rooms: Room[]
}

class MemoryStore {
  constructor () {
    this.users = [];
    this.rooms = [];
  }

  findRoomById (roomId: string): Room | null {
    return this.rooms.find(room => room.id === roomId)
  }

  insertRoom (room: Room) {
    this.rooms.push(room)

    return room
  }

  upsertRoom (room: Room): Room {
    const existingRoom = this.findRoomById(room.id)

    if (!existingRoom) return this.insertRoom(room)

    const index = this.rooms.findIndex(r => r.id === room.id);

    return Object.assign(this.rooms[index], room)
  }

  findUserById (userId: string): User | null {
    return this.users.find(u => u.id === userId)
  }

  insertUser (user: User): User {
    this.users.push(user)

    return user
  }

  upsertUser (user: User): User {
    const existingUser = this.findUserById(user.id)

    if (!existingUser) return this.insertUser(user)

    const index = this.users.findIndex(u => u.id === user.id);

    return Object.assign(this.users[index], user)
  }

  deleteUserById (id: string): boolean {
    if (!this.findUserById(id)) return true;

    const index = this.users.findIndex(u => u.id === id);
    const newUsers = this.users.slice();

    newUsers.splice(index, 1);

    this.users = newUsers;

    return true;
  }
}

const store = new MemoryStore()

export default store;
