import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

enum Events {
  CLIENTS_UPDATED = 'clients-updated',
}

@WebSocketGateway({ cors: true })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    this.messagesService.registerClient(client);

    this.server.emit(
      Events.CLIENTS_UPDATED,
      this.messagesService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesService.removeClient(client.id);

    this.server.emit(
      Events.CLIENTS_UPDATED,
      this.messagesService.getConnectedClients(),
    );
  }
}
