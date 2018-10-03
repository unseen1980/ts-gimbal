import express from 'express';
import http from 'http';
import socket from 'socket.io';
import path from 'path';

const app = express();
const server = new http.Server(app);
const io = socket(server);

app.use('/', express.static(path.join(__dirname, 'client')))

io.on('connection', (socket:any) => {
  console.log('a user connected');
  socket.on('hello', function(msg: string){
    console.log('message: ' + msg);
  });
});

server.listen(5000, function(){
  console.log('listening on *:5000');
});