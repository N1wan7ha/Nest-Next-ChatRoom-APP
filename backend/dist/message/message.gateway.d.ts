import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageService } from './message.service';
export declare class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly messageService;
    server: Server;
    constructor(messageService: MessageService);
    handleConnection(client: any): void;
    handleDisconnect(client: any): void;
    handleMessage(data: {
        text: string;
        userId: string;
    }): Promise<void>;
}
