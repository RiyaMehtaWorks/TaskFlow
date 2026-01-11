import { AUTH_TYPES } from "./types.js";
import { AuthService } from "./services/AuthService.js";
import { AuthController } from "./controllers/AuthController.js";
export function registerAuthModule(container) {
    // Bind service
    container
        .bind(AUTH_TYPES.AuthService)
        .to(AuthService)
        .inSingletonScope();
    // Bind controller
    container
        .bind(AUTH_TYPES.AuthController)
        .to(AuthController)
        .inSingletonScope();
}
