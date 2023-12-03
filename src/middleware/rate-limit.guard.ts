const rateLimit = require('express-rate-limit');

export function createRateLimiter(maxRequests: number, windowInMs: number) {
  return rateLimit({
    windowMs: windowInMs,
    max: maxRequests,
    message: 'Too many requests from this IP, please try again later',
  });
}
