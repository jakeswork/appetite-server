"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MemoryStore {
    constructor() {
        this.users = [];
        this.rooms = [];
    }
    findRoomById(roomId) {
        return this.rooms.find(room => room.id === roomId);
    }
    insertRoom(room) {
        this.rooms.push(room);
        return room;
    }
    upsertRoom(room) {
        const existingRoom = this.findRoomById(room.id);
        if (!existingRoom)
            return this.insertRoom(room);
        const index = this.rooms.findIndex(r => r.id === room.id);
        this.rooms[index] = room;
        return this.rooms[index];
    }
    usernameExistsInRoom(roomId, username) {
        const userExists = this.users.find(u => Boolean(u.room && u.room.id === roomId && u.username === username));
        return Boolean(userExists);
    }
    findUserById(userId) {
        return this.users.find(u => u.id === userId);
    }
    insertUser(user) {
        this.users.push(user);
        return user;
    }
    upsertUser(user) {
        const existingUser = this.findUserById(user.id);
        if (!existingUser)
            return this.insertUser(user);
        const index = this.users.findIndex(u => u.id === user.id);
        this.users[index] = user;
        return this.users[index];
    }
    deleteUserById(userId) {
        if (!this.findUserById(userId))
            return true;
        const usersWithoutId = this.users.filter(u => u.id !== userId);
        this.users = usersWithoutId;
        return true;
    }
}
const store = new MemoryStore();
exports.default = store;
//# sourceMappingURL=MemoryStore.js.map