import express from 'express';
import http from 'http';
import socket from 'socket.io';
import path from 'path';
import five from 'johnny-five';

const app = express();
const server = new http.Server(app);
const io = socket(server);
const board: five.Board = new five.Board();

interface IAxisValues {
  x: number;
  y: number;
}

// Arduino is up and running
board.on('ready', () => {
  const led: five.Led = new five.Led(13);
  const servo1: five.Servo = new five.Servo(10);
  const servo2: five.Servo = new five.Servo(11);

  const centerCamera = (): void => {
    servo1.center();
    servo2.to(60);
  };

  // Move camera for Face tracking.
  // TODO: Write a smart algorithm and remove hardcoded angle values
  const moveCamera = (data: IAxisValues) => {
    const servoX: number = data.x;
    const servoY: number = data.y;

    console.log(`Received x:${servoX} y:${servoY}`);

    if (servoX < 180) servo1.to(95);
    if (servoX > 270) servo1.to(85);
    if (servoY < 80) servo2.to(70);
    if (servoY > 200) servo2.to(60);

    return;
  }

  // Websockets connection estabished
  io.on('connection', socket => {
    socket.on('change:interval', data => {
      led.blink(data);
      moveCamera(data)
    });
  });

  centerCamera();

});

app.use('/', express.static(path.join(__dirname, 'client')))

server.listen(5000, function () {
  console.log('listening on *:5000');
});