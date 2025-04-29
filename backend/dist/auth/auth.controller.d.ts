import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
    }): Promise<import("../user/user.schema").User>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
    } | {
        message: string;
    }>;
}
