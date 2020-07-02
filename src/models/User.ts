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

  joinRoom (roomId: string): Room | null {
    const room = Room.findById(roomId);

    if (!room) return null;

    this.room = room.newUser(this.id)

    store.upsertUser(this)

    return room;
  }

  setUsername (username: string): User {
    this.username = username;

    store.upsertUser(this)

    return this;
  }

  addRestaurantToSelection (restaurant: Restaurant): User | null {
    if (this.vote.selection.length === 3) throw new Error('You have already selected 3 restaurants.')

    this.vote = {
      hasConfirmedSelection: false,
      selection: this.vote.selection.concat(restaurant)
    }

    store.upsertUser(this)

    return this;
  }

  removeRestaurantFromSelection (restaurantId: number): User | null {
    const index = this.vote.selection.findIndex(s => s.id === restaurantId)

    if (!index) return null;

    const newSelection = this.vote.selection.slice()

    newSelection.splice(index, 1)

    this.vote = {
      hasConfirmedSelection: false,
      selection: newSelection,
    }

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

