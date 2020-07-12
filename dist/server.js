"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express = require("express");
const http_1 = require("http");
const cors = require("cors");
// Services
const socketio_1 = require("./services/socketio");
// Routes
const cities_1 = require("./routes/v1/cities");
const restaurants_1 = require("./routes/v1/restaurants");
const cuisines_1 = require("./routes/v1/cuisines");
const app = express();
const server = http_1.createServer(app);
const PORT = process.env.PORT || 5000;
app.use('/api/v1/cities', cors(), cities_1.default);
app.use('/api/v1/restaurants', cors(), restaurants_1.default);
app.use('/api/v1/cuisines', cors(), cuisines_1.default);
server.listen(PORT, () => {
    socketio_1.default.connect(server);
    console.log(`Running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map