import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Socket } from "socket.io";
import { SOCKET_EVENTS } from "src/constants/sockets.constants";
import { Document, GoogleDocsDocument } from "src/models/document.schema";
@Injectable()
export class WebSocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();
  private readonly defaultValue = "";
  constructor(
    @InjectModel(Document.name) private documentModel: Model<GoogleDocsDocument>
  ) {}

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    socket.on(SOCKET_EVENTS.GET_DOCUMENT, async (documentId) => {
      const document = await this.findOrCreateDocument(documentId);
      socket.join(documentId);
      socket.emit(SOCKET_EVENTS.LOAD_DOCUMENT, document.data);

      socket.on(SOCKET_EVENTS.SEND_CHANGES, (delta) => {
        // Broadcast the changes to all clients except the sender
        socket.broadcast.to(documentId).emit(SOCKET_EVENTS.RECEIVE_CHANGES, delta);
      });

      socket.on(SOCKET_EVENTS.SAVE_DOCUMENT, async (data) => {
        await this.documentModel.findByIdAndUpdate(documentId, { data });
      });
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      this.connectedClients.delete(clientId);
    });
  }

  async findOrCreateDocument(documentId: string) {
    if (!documentId) return;

    let document = await this.documentModel.findById(documentId);

    if (document) return document;

    document = new this.documentModel({
      _id: documentId,
      data: this.defaultValue,
    });
    return document.save();
  }
}
