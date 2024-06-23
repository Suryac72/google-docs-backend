import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocIoAdapter } from './services/io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new DocIoAdapter(app));
  await app.listen(3001);
}
bootstrap();
