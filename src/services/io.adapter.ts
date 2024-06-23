import { IoAdapter } from "@nestjs/platform-socket.io";
import { INestApplication } from "@nestjs/common";
import { ServerOptions } from "socket.io";

export class DocIoAdapter extends IoAdapter {
  private readonly app: INestApplication;

  constructor(
    app: INestApplication,
  ) {
    super(app);
    this.app = app;
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: process.env.GOOGLE_DOCS_UI_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    return server;
  }
}
