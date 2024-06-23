import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebSocketService } from './services/web-socket.service';
import { SocketGateway } from './services/socket.gateway';
import { Document,DocumentSchema } from './models/document.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Document.name, schema: DocumentSchema }])
  ],
  controllers: [AppController],
  providers: [AppService, WebSocketService, SocketGateway],
})
export class AppModule {}
