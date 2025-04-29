import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema';
export declare class MessageService {
    private messageModel;
    constructor(messageModel: Model<MessageDocument>);
    create(text: string, userId: string): Promise<Message>;
    findAll(): Promise<Message[]>;
}
