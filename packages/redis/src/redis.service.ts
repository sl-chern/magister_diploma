import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string) {
    return await this.cache.get<string>(key);
  }

  async set(key: string, value: unknown, ttl: number) {
    return await this.cache.set(key, value, ttl);
  }

  async delete(key: string) {
    return await this.cache.del(key);
  }
}
