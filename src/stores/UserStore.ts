import { User, Room } from '../types/constants';
import City from '../models/City';

interface UserStore {
  activeUsers: Array<User>
}

class UserStore {
  constructor () {
    this.activeUsers = []
  }

  findById (id: string): User | null {
    const user = this.activeUsers.find(user => user.id === id)

    if (!user) return null;

    return user;
  }

  upsert (
    id: string,
    room: Room,
    username?: string
  ): User {
    const usernameTaken = this.activeUsers.find((user) => {
      return (
        user.username &&
        user.username === username &&
        user.room.id === room.id
      )
    })

    if (usernameTaken) throw new Error('Username has been taken.')

    const user = {
      id,
      username,
      room
    };

    const userExists = this.findById(id);

    if (userExists) {
      const i = this.activeUsers.findIndex(user => user.id === id)

      this.activeUsers[i] = user

      return user
    }

    this.activeUsers.push(user)

    return user
  }

  removeById (id: string): User | null {
    const i = this.activeUsers.findIndex(user => user.id === id)

    if (i < 0) return null;
    
    return this.activeUsers.splice(i, 1)[0]
  }

  findHostByRoomId (id: string): User | null {
    const host = this.activeUsers.find(user => user.room.id === id)

    if (!host) return null;

    return host;
  }

  findManyByRoomId (id: string): Array<User> {
    return this.activeUsers.filter(u => u.room.id === id)
  }

  getCountByRoomId (id: string): number {
    return this.findManyByRoomId(id).length
  }

  getCityByRoomId (id: string): City | null {
    const host = this.findHostByRoomId(id);

    if (!host) return null;

    return host.room.city;
  }

  getCuisinesByRoomId (id: string): number[] {
    const host = this.findHostByRoomId(id);

    if (!host) return null;

    return host.room.cuisines;
  }

  setUsername (id: string, username: string): User | null {
    const userExists = this.findById(id)

    if (!userExists) return null

    return this.upsert(id, userExists.room, username)
  }
}

export default UserStore;
