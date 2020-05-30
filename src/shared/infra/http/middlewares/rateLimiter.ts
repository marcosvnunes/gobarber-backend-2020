import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
});

const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redisClient,
  points: 3, // Number of points
  duration: 3, // Per second
  keyPrefix: 'rateLimiter',
  blockDuration: 10,
});

export default async function rateLimiterMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  rateLimiterRedis
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(_ => {
      res.status(429).send('Too Many Requests');
    });
}
