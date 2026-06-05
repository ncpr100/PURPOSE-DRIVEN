import { Redis } from "@upstash/redis";

// Singleton con lazy initialization
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  // Verificar si las variables de entorno existen
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn(
      "⚠️ [Cache Manager] Upstash Redis not configured. Cache disabled.",
    );
    return null;
  }

  // Crear instancia solo una vez (Singleton)
  if (!redisClient) {
    console.log("🔧 [Cache Manager] Initializing Upstash Redis client...");
    redisClient = new Redis({
      url,
      token,
    });
  }

  return redisClient;
}

export const cacheManager = {
  async get(key: string): Promise<string | null> {
    const redis = getRedisClient();
    if (!redis) return null;

    try {
      return await redis.get(key);
    } catch (error) {
      console.error(
        `❌ [Cache Manager] GET error for key "${key}":`,
        (error as Error).message,
      );
      return null;
    }
  },

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const redis = getRedisClient();
    if (!redis) return;

    try {
      if (ttl) {
        await redis.setex(key, ttl, value);
      } else {
        await redis.set(key, value);
      }
    } catch (error) {
      console.error(
        `❌ [Cache Manager] SET error for key "${key}":`,
        (error as Error).message,
      );
    }
  },

  async del(key: string): Promise<void> {
    const redis = getRedisClient();
    if (!redis) return;

    try {
      await redis.del(key);
    } catch (error) {
      console.error(
        `❌ [Cache Manager] DEL error for key "${key}":`,
        (error as Error).message,
      );
    }
  },
};
