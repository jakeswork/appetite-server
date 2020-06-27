import * as express from 'express';
import { createServer } from 'http';
import * as socketio from 'socket.io';
import * as cors from 'cors';

import formatMessage from './utils/formatMessage';
import { Room, User } from './types/constants';
import UserStore from './stores/UserStore';
import cities from './routes/v1/cities';
import restaurants from './routes/v1/restaurants';
import cuisines from './routes/v1/cuisines';
import City from './models/City';
import Cuisine from './models/Cuisine';

const app = express()

app.use('/api/v1/cities', cors(), cities)
app.use('/api/v1/restaurants', cors(), restaurants)
app.use('/api/v1/cuisines', cors(), cuisines)

const server = createServer(app)
const io = socketio(server)

const users = new UserStore();

const roomMetaUpdate = (room: Room) => (
  io.to(room.id).emit('roomUsersUpdated', {
    room,
    users: users.findManyByRoomId(room.id),
    count: users.getCountByRoomId(room.id)
  })
)

io.on('connection', (socket) => {
  socket.on('createRoom', (username: string, city: City, cuisines: number[]) => {
    try {
      const room = {
        id: socket.id,
        city,
        cuisines
      }
      const user = users.upsert(socket.id, room, username)

      socket.join(user.room.id)

      io.to(socket.id).emit('successfulCreate', user)

      roomMetaUpdate(user.room)
    } catch (e) {
      console.error(e)

      io.to(socket.id).emit('createRoomError', e.message)
    }
  })

  socket.on('joinRoom', (roomId: string) => {
    try {
      const city = users.getCityByRoomId(roomId);
      const cuisines = users.getCuisinesByRoomId(roomId);

      if (!city || !cuisines) throw new Error('Room does not exist')

      const room = {
        id: roomId,
        city,
        cuisines
      }
      const newUser = users.upsert(socket.id, room)

      socket.join(newUser.room.id)

      roomMetaUpdate(newUser.room)

      return io.to(socket.id).emit('successfulJoin', newUser)
    } catch (e) {
      console.error(e)

      io.to(socket.id).emit('joinRoomError', e.message)
    }
  })

  socket.on('setUsername', (username: string) => {
    try {
      const userUpdated = users.setUsername(socket.id, username)

      if (!userUpdated) return null;

      roomMetaUpdate(userUpdated.room)

      return io.to(socket.id).emit('successfulSetUsername', userUpdated)
    } catch (error) {
      console.error(error);

      io.to(socket.id).emit('setUsernameError', error.message)
    }
  })

  socket.on('sendMessage', (message: string) => {
    const user = users.findById(socket.id)

    if (!user) {
      io.to(socket.id).emit('sendMessageError', 'You are not registered to any room')

      return null
    };

    io.to(user.room.id).emit('message', formatMessage(user.username, message))
  })

  socket.on('disconnect', () => {
    const removedUser = users.removeById(socket.id)

    if (removedUser) roomMetaUpdate(removedUser.room)
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Running on port ${PORT}`));
