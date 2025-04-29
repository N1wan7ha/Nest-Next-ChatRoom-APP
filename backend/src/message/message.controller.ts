import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { text: string }, @Request() req: any) {
    return this.messageService.create(body.text, req.user.userId);
  }

  @Get()
  async findAll() {
    return this.messageService.findAll();
  }
}

