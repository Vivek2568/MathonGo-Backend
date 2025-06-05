const { RateLimiterRedis } = require('rate-limiter-flexible');
const { redisClient, connectRedis } = require('../config/redis');

// Create global rate limiter reference
let rateLimiter;

// Connect Redis and initialize limiter
async function setupRateLimiter() {
  await connectRedis();

  rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    points: 30,         // Allow 30 requests
    duration: 60,       // Per 60 seconds
    keyPrefix: 'middleware',
  });
}
setupRateLimiter();

// Get correct client IP (Cloudflare-aware)
function getClientIP(req) {
  const cfConnectingIP = req.headers['cf-connecting-ip'];
  const xForwardedFor = req.headers['x-forwarded-for'];

  return (
    cfConnectingIP ||
    (xForwardedFor && xForwardedFor.split(',')[0].trim()) ||
    req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

// Middleware to enforce rate limiting
async function rateLimitMiddleware(req, res, next) {
  const ip = getClientIP(req);
  console.log("Resolved IP:", ip); // Optional: debug logging

  // Skip rate limit for localhost or unknown IPs
  if (['127.0.0.1', '::1', '::ffff:127.0.0.1', 'unknown'].includes(ip)) {
    console.warn("Skipping rate limit for:", ip);
    return next();
  }

  try {
    await rateLimiter.consume(ip);
    next();
  } catch (rejRes) {
    const retrySecs = Math.round((rejRes.msBeforeNext || 0) / 1000) || 60;
    res.set('Retry-After', retrySecs);
    res.status(429).send(`Too Many Requests. Try again in ${retrySecs}s.`);
  }
}

module.exports = rateLimitMiddleware;
