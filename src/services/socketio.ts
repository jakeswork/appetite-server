import * as socketio from 'socket.io';

import User from '../models/User';
import Room from '../models/Room';
import City from '../models/City';
import Restaurant from '../models/Restaurant';

interface SocketIO {
  user: User;
  socket: socketio.Socket
  server: socketio.Server
}

interface SocketIOProps {
  socket: socketio.Socket;
  server: any;
}

class SocketIO {
  constructor ({ socket, server }: SocketIOProps) {
    this.user = User.create(socket.id)
    this.socket = socket;
    this.server = server;

    this.onCreateRoom()
    this.onJoinRoom()
    this.onSetUsername()
    this.onAddRestaurant()
    this.onRemoveRestaurant()
    this.onConfirmSelection()
    this.onSendMessage()
    this.onDisconnect()
  }

  static connect (server: any) {
    const io = socketio(server, {
      transports: ['websocket'],
      pingTimeout: 6000000
    })

    return io.on('connect', (s) => new SocketIO({ socket: s, server: io }))
  }

  onCreateRoom () {
    return this.socket.on('createRoom', (username: string, city: City, cuisines: number[]) => {
      try {
        this.user.setUsername(username)
  
        const room = Room.create({
          id: this.socket.id,
          city,
          cuisines
        })
  
        if (!room) return null;
  
        this.user.joinRoom(room.id)
  
        return this.socket.join(room.id, (error) => {
          if (error) return this.server.to(this.socket.id).emit('createRoomError', error.message)
  
          this.roomMetaUpdate()
  
          return this.server.to(this.user.id).emit('successfulCreate', this.user)
        })
      } catch (e) {
        console.error(e)
  
        return this.server.to(this.user.id).emit('createRoomError', e.message)
      }
    })
  }

  onJoinRoom () {
    return this.socket.on('joinRoom', (roomId: string) => {
      try {
        const joinedRoom = this.user.joinRoom(roomId)
  
        if (!joinedRoom) throw new Error('Room does not exist')
  
        return this.socket.join(joinedRoom.id, (error) => {
          if (error) return this.server.to(this.socket.id).emit('joinRoomError', error.message)
  
          this.roomMetaUpdate()
  
          return this.server.to(this.user.id).emit('successfulJoin', this.user)
        })
      } catch (e) {
        console.error(e)
  
        return this.server.to(this.user.id).emit('joinRoomError', e.message)
      }
    })
  }

  onSetUsername () {
    return this.socket.on('setUsername', (username: string) => {
      try {
        const userUpdated = this.user.setUsername(username)
  
        if (!userUpdated) return null;
  
        this.roomMetaUpdate()
  
        return this.server.to(this.user.id).emit('successfulSetUsername', userUpdated)
      } catch (error) {
        console.error(error);
  
        return this.server.to(this.user.id).emit('setUsernameError', error.message)
      }
    })
  }

  onAddRestaurant () {
    return this.socket.on('addRestaurant', (restaurant: Restaurant) => {
      const userUpdated = this.user.addRestaurantToSelection(restaurant)
  
      if (!userUpdated) return null;
  
      this.roomMetaUpdate()
  
      return this.server.to(this.user.id).emit('successfulAddRestaurant', userUpdated)
    })
  }

  onRemoveRestaurant () {
    return this.socket.on('removeRestaurant', (restaurantId: number) => {
      const userUpdated = this.user.removeRestaurantFromSelection(restaurantId)
  
      if (!userUpdated) return null;
  
      this.roomMetaUpdate()
  
      return this.server.to(this.user.id).emit('successfulRemoveRestaurant', userUpdated)
    })
  }

  onConfirmSelection () {
    return this.socket.on('confirmSelection', () => {
      const userUpdated = this.user.confirmVoteSelection()
  
      if (!userUpdated) return null;
  
      return this.server.to(this.user.id).emit('successfulConfirmSelection', userUpdated)
    })
  }

  onSendMessage () {
    return this.socket.on('sendMessage', (message: string) => {
      if (!this.user.room || !this.user.room.id) {
        this.server.to(this.user.id).emit('sendMessageError', 'You are not registered to any room')
  
        return null
      };
  
      return this.server.to(this.user.room.id).emit('message', message)
    })
  }

  onDisconnect () {
    return this.socket.on('disconnect', () => {
      const previousRoom = this.user.leaveRoom()

      this.roomMetaUpdate(previousRoom)

      this.user.delete()

      delete this.user
    })
  }

  roomMetaUpdate (r?: Room) {
    if (r) {
      const room = Room.findById(r.id)
      const users = room.users.map(userId => User.findById(userId)).filter(u => u)

      return this.server.to(room.id).emit('roomUsersUpdated', {
        users,
        count: users.length
      })
    }

    if (!this.user.room) return null;

    const room = Room.findById(this.user.room.id)
    const users = room.users.map(userId => User.findById(userId)).filter(u => u)

    return this.server.to(this.user.room.id).emit('roomUsersUpdated', {
      users,
      count: users.length
    })
  }
}

export default SocketIO;
