import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    createUser(email: string, hashedPassword: string): Promise<User>;
    findByEmail(email: string): Promise<User | undefined>;
}
