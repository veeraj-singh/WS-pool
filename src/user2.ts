import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { RedisClient } from './singleton';

const wss = new WebSocketServer({ port : 8080 });

const users: {
  [key: string]: {
    room: string;
    ws: any;
  }
} = {};

wss.on('connection', async function connection(ws) {
  const id = uuidv4()

  ws.on('error', console.error);

  ws.on('message', (message) => {
    console.log(JSON.parse(message.toString()))
    const data = JSON.parse(message.toString());
    if (data.type === "join") {
      users[id] = {
        room: data.payload.roomId,
        ws
      };
      RedisClient.getInstance().subscribe(id, data.payload.roomId, ws);
    }

    if (data.type === "message") {
      const roomId = users[id].room;
      const message = data.payload.message;
      RedisClient.getInstance().publish(roomId, message);
    }

  });

  ws.send(`Hello! Message From Server!!. id is ${id}`);

  ws.on('close', () => {
    console.log('Client disconnected');
    RedisClient.getInstance().unsubscribe(id, users[id].room);
  });

});


