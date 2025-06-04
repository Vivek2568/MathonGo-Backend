const { RateLimiterRedis } = require('rate-limiter-flexible');
const { redisClient, connectRedis } = require('../config/redis');

let rateLimiter; 

async function setupRateLimiter() {
  await connectRedis();

  rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    points: 30,
    duration: 60,
    keyPrefix: 'middleware',
  });
}
setupRateLimiter();

async function rateLimitMiddleware(req, res, next) {
  const ip = req.ip;

  if (ip === '127.0.0.1' || ip === '::1') {
    return next();
  }

  try {
    await rateLimiter.consume(ip);
    next();
  } catch (rejRes) {
    const retrySecs = Math.round((rejRes.msBeforeNext || 0) / 1000) || 60;
    res.set('Retry-After', retrySecs);
    res.status(429).send('Too Many Requests');
  }
}

module.exports = rateLimitMiddleware;
