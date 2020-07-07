import Room from './Room';
import Restaurant from './Restaurant';
import store from '../stores/MemoryStore';
import { UserVote, User as UserType } from "../types/constants";

interface User {
  id: string;
  username?: string;
  room: Room;
  vote: UserVote;
}

class User {
  constructor (props: UserType) {
    Object.assign(this, props)
  }

  static create (userId: string): User | null {
    const userAlreadyExists = store.findUserById(userId)

    if (userAlreadyExists) return null;

    const user: UserType = {
      id: userId,
      room: null,
      vote: {
        hasConfirmedSelection: false,
        selection: []
      }
    }

    store.insertUser(user)

    return new User(user)
  }

  static findById (userId: string): User | null {
    const user = store.findUserById(userId)

    if (!user) return null;

    return new User(user)
  }

  joinRoom (roomId: string): Room | null {
    const room = Room.findById(roomId);

    if (!room) return null;

    this.room = room.addUser(this.id)

    store.upsertUser(this)

    return room;
  }

  leaveRoom (): Room | null {
    if (!this.room) return null;

    const previousRoom = this.room.removeUser(this.id)

    this.room = null;

    store.upsertUser(this);

    return previousRoom
  }

  setUsername (username: string): User {
    if (this.room && this.room.id) {
      const usernameTaken = store.usernameExistsInRoom(this.room.id, username)

      if (usernameTaken) throw new Error('Username is taken.')
    }

    this.username = username;

    store.upsertUser(this)

    return this;
  }

  updateRestaurantSelection (restaurant: Restaurant): User {
    const restaurantExists = this.vote.selection.findIndex(r => r.id === restaurant.id) > -1

    if (restaurantExists) {
      this.vote = {
        hasConfirmedSelection: false,
        selection: this.vote.selection.filter(r => r.id !== restaurant.id)
      }
  
      store.upsertUser(this)
  
      return this;
    }

    if (this.vote.selection.length === 3) throw new Error('You have already selected 3 restaurants.')

    this.vote.hasConfirmedSelection = false;

    this.vote.selection.push(restaurant)

    store.upsertUser(this)

    return this;
  }

  confirmVoteSelection(): User {
    if (this.vote.selection.length < 1) throw new Error('You must select at least one restaurant before confirming.')

    this.vote = {
      hasConfirmedSelection: true,
      selection: this.vote.selection,
    };

    store.upsertUser(this);

    return this;
  }

  delete (): boolean {
    return store.deleteUserById(this.id);
  }
}

export default User;

