import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AppController } from './app.controller';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: { 
          url: 'redis://localhost:6379',
        },
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}

