# RedisClient for WebSocket PubSub Management

## Overview
This is a TypeScript class designed to manage Redis-based PubSub (Publish-Subscribe) for WebSocket servers. It uses Redis to handle message broadcasting across multiple WebSocket connections, ensuring scalability and efficient message routing. The class is implemented as a Singleton to ensure a single instance manages all subscriptions and publications.

---

## Features
- **Singleton Design**: Ensures a single instance of the `RedisClient` across the application.
- **Redis Integration**: Uses Redis for PubSub to handle message broadcasting efficiently.
- **Scalable**: Supports multiple rooms and users, making it ideal for real-time applications.
- **Automatic Cleanup**: Unsubscribes from Redis channels when no users are left in a room.

---

## Class Architecture

### Key Components
1. **Redis Clients**:
   - `subscriber`: Subscribes to Redis channels.
   - `publisher`: Publishes messages to Redis channels.

2. **Data Structures**:
   - `subscriptions`: Maps `userId` to an array of rooms they are subscribed to.
   - `reverseSubscriptions`: Maps `room` to a dictionary of users (with their WebSocket connections) in that room.

3. **Methods**:
   - `subscribe(userId, room, ws)`: Subscribes a user to a room and sets up Redis subscription if the room is new.
   - `unsubscribe(userId, room)`: Unsubscribes a user from a room and cleans up Redis subscription if the room is empty.
   - `publish(room, message)`: Publishes a message to a Redis channel.

---

## Usage

### Installation
Ensure you have the required dependencies installed:
```bash
npm install ws @types/ws redis
