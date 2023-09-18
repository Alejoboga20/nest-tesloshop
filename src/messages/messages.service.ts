import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

type Client = {
  [id: string]: Socket;
};

@Injectable()
export class MessagesService {
  private connectedClients: Client = {};

  registerClient(client: Socket) {
    this.connectedClients[client.id] = client;
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients() {
    return Object.keys(this.connectedClients).length;
  }
}
