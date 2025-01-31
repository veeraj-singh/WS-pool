"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const redis_1 = require("redis");
class RedisClient {
    constructor() {
        this.subscriber = (0, redis_1.createClient)();
        this.publisher = (0, redis_1.createClient)();
        this.publisher.connect();
        this.subscriber.connect();
        this.subscriptions = new Map;
        this.reverseSubscriptions = new Map;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new RedisClient();
        }
        return this.instance;
    }
    subscribe(userId, room, ws) {
        this.subscriptions.set(userId, [
            ...(this.subscriptions.get(userId) || []),
            room
        ]);
        this.reverseSubscriptions.set(room, Object.assign(Object.assign({}, (this.reverseSubscriptions.get(room) || {})), { [userId]: { userId, ws } }));
        if (Object.keys(this.reverseSubscriptions.get(room) || {}).length === 1) {
            console.log(`First User came, Now subscribing to the room - ${room}`);
            this.subscriber.subscribe(room, (payload) => {
                try {
                    Object.values(this.reverseSubscriptions.get(room) || {}).forEach(({ ws }) => {
                        ws.send(payload);
                    });
                }
                catch (e) {
                    console.log('error in the payload');
                }
            });
        }
    }
    unsubscribe(userId, roomToUnsubscribe) {
        var _a, _b, _c;
        this.subscriptions.set(userId, ((_a = this.subscriptions.get(userId)) === null || _a === void 0 ? void 0 : _a.filter((room) => room !== roomToUnsubscribe)) || []);
        if (((_b = this.subscriptions.get(userId)) === null || _b === void 0 ? void 0 : _b.length) === 0) {
            this.subscriptions.delete(userId);
        }
        (_c = this.reverseSubscriptions.get(roomToUnsubscribe)) === null || _c === void 0 ? true : delete _c[userId];
        if (Object.keys(this.reverseSubscriptions.get(roomToUnsubscribe) || []).length === 0) {
            console.log(`Deleting this room - ${roomToUnsubscribe} as there are no users left inside it`);
            this.subscriber.unsubscribe(roomToUnsubscribe);
            this.reverseSubscriptions.delete(roomToUnsubscribe);
        }
    }
    publish(room, message) {
        console.log(`publishing message to ${room}`);
        this.publisher.publish(room, message);
    }
}
exports.RedisClient = RedisClient;
