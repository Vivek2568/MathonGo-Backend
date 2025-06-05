const { RateLimiterRedis } = require('rate-limiter-flexible');
const { redisClient, connectRedis } = require('../config/redis');

let rateLimiter;

async function setupRateLimiter() {
  try {
    await connectRedis();

    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });

    rateLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      points: 100, 
      duration: 60, 
      keyPrefix: 'middleware',
    });

    console.log('Rate limiter initialized');
  } catch (err) {
    console.error('Failed to setup rate limiter:', err);
  }
}
setupRateLimiter();

function getClientIP(req) {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map(ip => ip.trim());
    return ips[0];
  }
  return req.ip || req.connection.remoteAddress || 'unknown';
}

async function rateLimitMiddleware(req, res, next) {
  const ip = getClientIP(req);
  console.log('Client IP:', ip);

  if (ip === '127.0.0.1' || ip === '::1' || ip === 'unknown') {
    return next();
  }
  if (!rateLimiter) {
    console.warn('Rate limiter not initialized yet');
    return next();
  }

  try {
    await rateLimiter.consume(ip); 
    next();
  } catch (rejRes) {
    const retrySecs = Math.round((rejRes.msBeforeNext || 0) / 1000) || 60;
    res.set('Retry-After', retrySecs);
    res.status(429).send('Too Many Requests - try again in ' + retrySecs + ' seconds');
  }
}

module.exports = rateLimitMiddleware;
