// Dependencies
import * as express from 'express';
import { createServer } from 'http';
import * as cors from 'cors';

// Services
import SocketIO from './services/socketio';

// Routes
import cities from './routes/v1/cities';
import restaurants from './routes/v1/restaurants';
import cuisines from './routes/v1/cuisines';

const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 5000

app.use('/api/v1/cities', cors(), cities)
app.use('/api/v1/restaurants', cors(), restaurants)
app.use('/api/v1/cuisines', cors(), cuisines)

server.listen(PORT, () => {
  SocketIO.connect(server)

  console.log(`Running on port ${PORT}`)
});
