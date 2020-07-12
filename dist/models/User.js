"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = require("./Room");
const MemoryStore_1 = require("../stores/MemoryStore");
class User {
    constructor(props) {
        Object.assign(this, props);
    }
    static create(userId) {
        const userAlreadyExists = MemoryStore_1.default.findUserById(userId);
        if (userAlreadyExists)
            return null;
        const user = {
            id: userId,
            room: null,
            vote: {
                hasConfirmedSelection: false,
                selection: []
            }
        };
        MemoryStore_1.default.insertUser(user);
        return new User(user);
    }
    static findById(userId) {
        const user = MemoryStore_1.default.findUserById(userId);
        if (!user)
            return null;
        return new User(user);
    }
    joinRoom(roomId) {
        const room = Room_1.default.findById(roomId);
        if (!room)
            return null;
        this.room = room.addUser(this.id);
        MemoryStore_1.default.upsertUser(this);
        return room;
    }
    leaveRoom() {
        if (!this.room)
            return null;
        const previousRoom = this.room.removeUser(this.id);
        this.room = null;
        MemoryStore_1.default.upsertUser(this);
        return previousRoom;
    }
    setUsername(username) {
        if (this.room && this.room.id) {
            const usernameTaken = MemoryStore_1.default.usernameExistsInRoom(this.room.id, username);
            if (usernameTaken)
                throw new Error('Username is taken.');
        }
        this.username = username;
        MemoryStore_1.default.upsertUser(this);
        return this;
    }
    updateRestaurantSelection(restaurant) {
        const restaurantExists = this.vote.selection.findIndex(r => r.id === restaurant.id) > -1;
        if (restaurantExists) {
            this.vote = {
                hasConfirmedSelection: false,
                selection: this.vote.selection.filter(r => r.id !== restaurant.id)
            };
            MemoryStore_1.default.upsertUser(this);
            return this;
        }
        if (this.vote.selection.length === 3)
            throw new Error('You have already selected 3 restaurants.');
        this.vote.hasConfirmedSelection = false;
        this.vote.selection.push(restaurant);
        MemoryStore_1.default.upsertUser(this);
        return this;
    }
    confirmVoteSelection() {
        if (this.vote.selection.length < 1)
            throw new Error('You must select at least one restaurant before confirming.');
        this.vote = {
            hasConfirmedSelection: true,
            selection: this.vote.selection,
        };
        MemoryStore_1.default.upsertUser(this);
        return this;
    }
    delete() {
        return MemoryStore_1.default.deleteUserById(this.id);
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map