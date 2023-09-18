import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';

import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

type Client = {
  [id: string]: {
    socket: Socket;
    user: User;
  };
};

@Injectable()
export class MessagesService {
  private connectedClients: Client = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User is not active');

    this.connectedClients[client.id] = {
      socket: client,
      user,
    };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients() {
    return Object.keys(this.connectedClients);
  }

  getUserFullName(clientId: string) {
    return this.connectedClients[clientId].user.fullName;
  }
}
