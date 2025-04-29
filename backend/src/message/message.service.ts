import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

  async create(text: string, userId: string): Promise<Message> {
    const createdMessage = new this.messageModel({ text, userId });
    return createdMessage.save();
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.find().populate('userId', 'email').sort({ createdAt: -1 }).exec();
  }
}

