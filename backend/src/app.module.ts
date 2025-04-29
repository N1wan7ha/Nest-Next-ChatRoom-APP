import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://niwantha2885:NM0gGJfHCneLf6fK@cluster0.2veqyx9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    UserModule,
    AuthModule,
    MessageModule, // we will update this later
  ],
})
export class AppModule {}

