import * as express from 'express';
import { createServer } from 'http';
import * as socketio from 'socket.io';
import * as cors from 'cors';

import formatMessage from './utils/formatMessage';
import cities from './routes/v1/cities';
import restaurants from './routes/v1/restaurants';
import cuisines from './routes/v1/cuisines';
import City from './models/City';
import Restaurant from './models/Restaurant';
import User from './models/User';
import Room from './models/Room';

const app = express()

app.use('/api/v1/cities', cors(), cities)
app.use('/api/v1/restaurants', cors(), restaurants)
app.use('/api/v1/cuisines', cors(), cuisines)

const server = createServer(app)
const io = socketio(server)

const roomMetaUpdate = (room: Room) => (
  io.to(room.id).emit('roomUsersUpdated', {
    room,
    count: room.users.length
  })
)

io.on('connect', (socket) => {
  const user = User.create(socket.id)

  socket.on('createRoom', (username: string, city: City, cuisines: number[]) => {
    try {
      user.setUsername(username)

      const room = Room.create({
        id: socket.id,
        city,
        cuisines
      })

      if (!room) return null;

      user.joinRoom(room.id)

      socket.join(room.id, (error) => {
        if (error) return io.to(socket.id).emit('createRoomError', error.message)

        roomMetaUpdate(room)

        io.to(user.id).emit('successfulCreate', user)
      })
    } catch (e) {
      console.error(e)

      io.to(user.id).emit('createRoomError', e.message)
    }
  })

  socket.on('joinRoom', (roomId: string) => {
    try {
      const joinedRoom = user.joinRoom(roomId)

      if (!joinedRoom) throw new Error('Room does not exist')

      socket.join(joinedRoom.id, (error) => {
        if (error) return io.to(socket.id).emit('joinRoomError', error.message)

        roomMetaUpdate(joinedRoom)

        io.to(user.id).emit('successfulJoin', user)
      })
    } catch (e) {
      console.error(e)

      io.to(user.id).emit('joinRoomError', e.message)
    }
  })

  socket.on('setUsername', (username: string) => {
    try {
      const userUpdated = user.setUsername(username)

      if (!userUpdated) return null;

      roomMetaUpdate(userUpdated.room)

      return io.to(user.id).emit('successfulSetUsername', userUpdated)
    } catch (error) {
      console.error(error);

      io.to(user.id).emit('setUsernameError', error.message)
    }
  })

  socket.on('addRestaurant', (restaurant: Restaurant) => {
    const userUpdated = user.addRestaurantToSelection(restaurant)

    if (!userUpdated) return null;

    roomMetaUpdate(userUpdated.room)

    return io.to(user.id).emit('successfulAddRestaurant', userUpdated)
  })

  socket.on('removeRestaurant', (restaurantId: number) => {
    const userUpdated = user.removeRestaurantFromSelection(restaurantId)

    if (!userUpdated) return null;

    roomMetaUpdate(userUpdated.room)

    return io.to(user.id).emit('successfulRemoveRestaurant', userUpdated)
  })

  socket.on('confirmSelection', () => {
    const userUpdated = user.confirmVoteSelection()

    if (!userUpdated) return null;

    return io.to(user.id).emit('successfulConfirmSelection', userUpdated)
  })

  socket.on('sendMessage', (message: string) => {
    if (!user.room || !user.room.id) {
      io.to(user.id).emit('sendMessageError', 'You are not registered to any room')

      return null
    };

    io.to(user.room.id).emit('message', formatMessage(user.username, message))
  })

  socket.on('disconnect', () => {
    const removedUser = user.delete()

    if (removedUser && user.room) roomMetaUpdate(user.room)
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Running on port ${PORT}`));
