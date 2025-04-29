import { MessageService } from './message.service';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    create(body: {
        text: string;
    }, req: any): Promise<any>;
    findAll(): Promise<any>;
}
