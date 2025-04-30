import { Module } from "@nestjs/common";
import { RedisService } from "src/redis/redis.service";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-yet";

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          url: process.env.REDIS_URI,
        }),
      }),
    }),
  ],
  exports: [RedisService],
  providers: [RedisService],
})
export class RedisModule {}
