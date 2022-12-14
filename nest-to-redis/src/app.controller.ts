import { Controller, Get, } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Controller()
export class AppController {
  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Get()
  async getHello() {
    await this.redis.set('key', 'Redis key!');
    const redisData = await this.redis.get("key");
    return { redisData };
  }
}