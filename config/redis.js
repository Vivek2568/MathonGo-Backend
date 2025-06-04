const { createClient } = require('redis');

const redisClient = createClient({
  socket: {
    host: 'redis-12921.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 12921,
  },
  username: 'default',
  password: 'bbK0hjwBz3tfgXOxaRazjzzRtFkWcEte',
  legacyMode: true,
});

redisClient.on('error', (err) => console.error(' Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis connected'));

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log(' Connected to Redis Cloud');
  }
}

module.exports = { redisClient, connectRedis };
