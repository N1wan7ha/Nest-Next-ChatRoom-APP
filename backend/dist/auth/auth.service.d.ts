import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(email: string, password: string): Promise<any>;
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: any;
    }>;
}
