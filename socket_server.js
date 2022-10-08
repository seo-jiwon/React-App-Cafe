const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server);
const port = 3000;

io.on("connection", socket => {
    console.log("hello -  connect");
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world test test </h1>');
});

server.listen(port, () => {
  console.log('listening on *: zion ~' + port);
});


