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
const socketio = require("socket.io");
const User_1 = require("../models/User");
const Room_1 = require("../models/Room");
class SocketIO {
    constructor({ socket, server }) {
        this.user = User_1.default.create(socket.id);
        this.socket = socket;
        this.server = server;
        this.onCreateRoom();
        this.onJoinRoom();
        this.onSetUsername();
        this.onUpdateSelection();
        this.onConfirmSelection();
        this.onSendMessage();
        this.onGetMessageHistory();
        this.onDisconnect();
    }
    static connect(server) {
        const io = socketio(server, {
            transports: ['websocket'],
            pingTimeout: 6000000
        });
        return io.on('connect', (s) => new SocketIO({ socket: s, server: io }));
    }
    onCreateRoom() {
        return this.socket.on('createRoom', (username, city, cuisines) => {
            try {
                this.user.setUsername(username);
                const room = Room_1.default.create({
                    id: this.socket.id,
                    city,
                    cuisines
                });
                if (!room)
                    return null;
                this.user.joinRoom(room.id);
                return this.socket.join(room.id, (error) => {
                    if (error)
                        return this.server.to(this.socket.id).emit('createRoomError', error.message);
                    this.roomMetaUpdate();
                    return this.server.to(this.user.id).emit('successfulCreate', this.user);
                });
            }
            catch (e) {
                console.error(e);
                return this.server.to(this.user.id).emit('createRoomError', e.message);
            }
        });
    }
    onJoinRoom() {
        return this.socket.on('joinRoom', (roomId) => {
            try {
                const joinedRoom = this.user.joinRoom(roomId);
                if (!joinedRoom)
                    throw new Error('Room does not exist');
                return this.socket.join(joinedRoom.id, (error) => {
                    if (error)
                        return this.server.to(this.socket.id).emit('joinRoomError', error.message);
                    this.roomMetaUpdate();
                    return this.server.to(this.user.id).emit('successfulJoin', this.user);
                });
            }
            catch (e) {
                console.error(e);
                return this.server.to(this.user.id).emit('joinRoomError', e.message);
            }
        });
    }
    onSetUsername() {
        return this.socket.on('setUsername', (username) => {
            try {
                const userUpdated = this.user.setUsername(username);
                if (!userUpdated)
                    return null;
                this.roomMetaUpdate();
                return this.server.to(this.user.id).emit('successfulSetUsername', userUpdated);
            }
            catch (error) {
                console.error(error);
                return this.server.to(this.user.id).emit('setUsernameError', error.message);
            }
        });
    }
    onUpdateSelection() {
        if (this.user.vote.hasConfirmedSelection)
            return null;
        return this.socket.on('updateSelection', (restaurant) => {
            try {
                const userUpdated = this.user.updateRestaurantSelection(restaurant);
                this.roomMetaUpdate();
                return this.server.to(this.user.id).emit('successfulUpdateSelection', userUpdated);
            }
            catch (error) {
                console.error(error);
                return this.server.to(this.user.id).emit('updateSelectionError', error.message);
            }
        });
    }
    onConfirmSelection() {
        if (this.user.vote.hasConfirmedSelection)
            return null;
        return this.socket.on('confirmSelection', () => __awaiter(this, void 0, void 0, function* () {
            const userUpdated = this.user.confirmVoteSelection();
            if (!userUpdated)
                return null;
            const voteResults = yield this.user.room.getVoteResults();
            if (voteResults) {
                this.server.to(this.user.room.id).emit('voteComplete', Object.assign({ users: this.user.room.users }, voteResults));
            }
            this.roomMetaUpdate();
            return this.server.to(this.user.id).emit('successfulConfirmSelection', userUpdated);
        }));
    }
    onSendMessage() {
        return this.socket.on('sendMessage', (content) => {
            if (!this.user.room || !this.user.room.id) {
                return this.server.to(this.user.id).emit('sendMessageError', 'You are not registered to any room');
            }
            ;
            const timestamp = new Date().toISOString();
            const message = {
                from: this.user.id,
                displayName: this.user.username,
                timestamp,
                content
            };
            this.user.room.addMessage(message);
            return this.server.to(this.user.room.id).emit('messageHistoryUpdated', this.user.room.messages);
        });
    }
    onGetMessageHistory() {
        return this.socket.on('getMessageHistory', () => {
            if (!this.user.room || !this.user.room.id) {
                return this.server.to(this.user.id).emit('getMessageHistoryError', 'You are not registered to any room');
            }
            ;
            return this.server.to(this.user.id).emit('messageHistory', this.user.room.messages);
        });
    }
    onDisconnect() {
        return this.socket.on('disconnect', () => {
            const previousRoom = this.user.leaveRoom();
            this.roomMetaUpdate(previousRoom);
            this.user.delete();
            delete this.user;
        });
    }
    roomMetaUpdate(r) {
        if (r) {
            const room = Room_1.default.findById(r.id);
            const users = room.users.map(userId => User_1.default.findById(userId)).filter(u => u);
            return this.server.to(room.id).emit('roomUsersUpdated', {
                users,
                count: users.length,
            });
        }
        if (!this.user.room)
            return null;
        const room = Room_1.default.findById(this.user.room.id);
        const users = room.users.map(userId => User_1.default.findById(userId)).filter(u => u);
        return this.server.to(this.user.room.id).emit('roomUsersUpdated', {
            users,
            count: users.length,
        });
    }
}
exports.default = SocketIO;
//# sourceMappingURL=socketio.js.map