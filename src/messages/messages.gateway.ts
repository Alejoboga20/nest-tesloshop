import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtPayload } from 'src/auth/interfaces';

enum Events {
  CLIENTS_UPDATED = 'clients-updated',
}

@WebSocketGateway({ cors: true })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

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

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log('here');
    // To emit to the same client
    /* client.emit('message-from-server', {
      fullName: 'alejo',
      message: payload.message,
    }); */
    // To emit to every one but the same client
    /* client.broadcast.emit('message-from-server', {
      fullName: 'alejo',
      message: payload.message,
    }); */
    // to emit to every one
    this.server.emit('message-from-server', {
      fullName: this.messagesService.getUserFullName(client.id),
      message: payload.message,
    });
  }
}
