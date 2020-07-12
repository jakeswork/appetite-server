"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MemoryStore_1 = require("../stores/MemoryStore");
const User_1 = require("./User");
const utils_1 = require("../utils");
const Restaurant_1 = require("./Restaurant");
class Room {
    constructor(props) {
        Object.assign(this, props);
    }
    static create(room) {
        const roomId = `R_${room.id}`;
        const alreadyExists = Room.findById(roomId);
        if (alreadyExists)
            return null;
        const withDefaults = Object.assign(Object.assign({}, room), { id: roomId, users: [], messages: [] });
        MemoryStore_1.default.insertRoom(withDefaults);
        return new Room(withDefaults);
    }
    static findById(roomId) {
        const room = MemoryStore_1.default.findRoomById(roomId);
        if (!room)
            return null;
        return new Room(room);
    }
    addUser(userId) {
        const index = this.users.indexOf(userId);
        if (index > -1)
            return null;
        this.users.push(userId);
        MemoryStore_1.default.upsertRoom(this);
        return this;
    }
    removeUser(userId) {
        const usersWithoutId = this.users.filter(u => u !== userId);
        this.users = usersWithoutId;
        MemoryStore_1.default.upsertRoom(this);
        return this;
    }
    addMessage(message) {
        this.messages.push(message);
        MemoryStore_1.default.upsertRoom(this);
        return;
    }
    getVoteResults() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.users || !this.users.length)
                return null;
            const users = this.users.map(userId => User_1.default.findById(userId)).filter(u => u);
            const allUsersHaveVoted = users.every(u => u.vote.hasConfirmedSelection);
            if (!allUsersHaveVoted)
                return null;
            const usersSelections = [].concat(...users.map(({ vote }) => vote.selection));
            const restaurants = usersSelections.map(({ id }) => id);
            const cuisines = [].concat(...usersSelections.map(({ cuisines }) => cuisines.split(', ')));
            const mostCommonRestaurants = utils_1.mostCommonEntries(restaurants);
            const mostCommonCuisines = utils_1.mostCommonEntries(cuisines, 3);
            const resolvedRestaurants = yield Promise.all(mostCommonRestaurants.map(id => Restaurant_1.default.findById(id)));
            return {
                mostCommonRestaurants: resolvedRestaurants,
                mostCommonCuisines,
            };
        });
    }
}
exports.default = Room;
//# sourceMappingURL=Room.js.map