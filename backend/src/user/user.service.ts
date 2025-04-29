import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema'; // Correct import

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // This is the createUser method to create a new user
  async createUser(email: string, hashedPassword: string): Promise<User> {
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
    });
    return await newUser.save(); // Save the user to the database
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return undefined;
    }
    return user;
  }
}

