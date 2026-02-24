const redis = require('redis');
const logger = require('../utils/logger');

let redisClient = null;

// Initialize Redis client
if (process.env.REDIS_HOST) {
  redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD || undefined
  });

  redisClient.on('error', (err) => logger.error('Redis Client Error', err));
  redisClient.on('connect', () => logger.info('Redis Client Connected'));

  // Connect to Redis
  (async () => {
    await redisClient.connect();
  })();
}

exports.get = async (key) => {
  if (!redisClient) return null;
  
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Redis get error:', error);
    return null;
  }
};

exports.set = async (key, value, ttl = 3600) => {
  if (!redisClient) return false;
  
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttl
    });
    return true;
  } catch (error) {
    logger.error('Redis set error:', error);
    return false;
  }
};

exports.del = async (key) => {
  if (!redisClient) return false;
  
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Redis del error:', error);
    return false;
  }
};

exports.delPattern = async (pattern) => {
  if (!redisClient) return false;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    logger.error('Redis delPattern error:', error);
    return false;
  }
};