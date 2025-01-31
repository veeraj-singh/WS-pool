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
const ws_1 = require("ws");
const uuid_1 = require("uuid");
const singleton_1 = require("./singleton");
const wss = new ws_1.WebSocketServer({ port: 3000 });
const users = {};
wss.on('connection', function connection(ws) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = (0, uuid_1.v4)();
        ws.on('error', console.error);
        ws.on('message', (message) => {
            const data = JSON.parse(message.toString());
            if (data.type === "join") {
                users[id] = {
                    room: data.payload.roomId,
                    ws
                };
                singleton_1.RedisClient.getInstance().subscribe(id, data.payload.roomId, ws);
            }
            if (data.type === "message") {
                const roomId = users[id].room;
                const message = data.payload.message;
                singleton_1.RedisClient.getInstance().publish(roomId, message);
            }
        });
        ws.send(`Hello! Message From Server!!. id is ${id}`);
        ws.on('close', () => {
            console.log('Client disconnected');
            singleton_1.RedisClient.getInstance().unsubscribe(id, users[id].room);
        });
    });
});
