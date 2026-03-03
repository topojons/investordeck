import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redis: Redis | null = null;
let isConnected = false;

const initRedis = async () => {
  if (isConnected && redis) {
    return redis;
  }

  try {
    redis = new Redis(REDIS_URL);

    redis.on('connect', () => {
      console.log('Redis connected successfully');
      isConnected = true;
    });

    redis.on('error', (err) => {
      console.error('Redis connection error:', err);
      isConnected = false;
    });

    return redis;
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    isConnected = false;
    return null;
  }
};

export const cacheGet = async (key: string): Promise<string | null> => {
  try {
    const client = redis || (await initRedis());
    if (!client || !isConnected) {
      return null;
    }
    return await client.get(key);
  } catch (error) {
    console.error(`Cache get error for key ${key}:`, error);
    return null;
  }
};

export const cacheSet = async (
  key: string,
  value: string | object,
  ttlSeconds: number = 3600
): Promise<boolean> => {
  try {
    const client = redis || (await initRedis());
    if (!client || !isConnected) {
      return false;
    }

    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await client.setex(key, ttlSeconds, stringValue);
    return true;
  } catch (error) {
    console.error(`Cache set error for key ${key}:`, error);
    return false;
  }
};

export const cacheDel = async (key: string): Promise<boolean> => {
  try {
    const client = redis || (await initRedis());
    if (!client || !isConnected) {
      return false;
    }
    await client.del(key);
    return true;
  } catch (error) {
    console.error(`Cache del error for key ${key}:`, error);
    return false;
  }
};

export const cacheGetJSON = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await cacheGet(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Cache getJSON error for key ${key}:`, error);
    return null;
  }
};

export const initializeCache = async () => {
  await initRedis();
};
