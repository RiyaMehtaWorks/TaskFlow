import { Container } from "inversify";
import { AUTH_TYPES } from "./types.js";
import { AuthService } from "./services/AuthService.js";
import { AuthController } from "./controllers/AuthController.js";
import { IAuthService } from "./interfaces/IAuthService.js";

export function registerAuthModule(container: Container) {
  // Bind service
  container
    .bind<IAuthService>(AUTH_TYPES.AuthService)
    .to(AuthService)
    .inSingletonScope();

  // Bind controller
  container
    .bind<AuthController>(AUTH_TYPES.AuthController)
    .to(AuthController)
    .inSingletonScope();
}
