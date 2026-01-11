import {
  JsonController,
  Get,
  Authorized,
  CurrentUser,
} from "routing-controllers";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../types.js";
import { IAuthService } from "../interfaces/IAuthService.js";

@injectable()
@JsonController("/auth")
export class AuthController {
  constructor(
    @inject(AUTH_TYPES.AuthService) private authService: IAuthService
  ) {}

  @Get("/me")
  @Authorized()
  async getCurrentUser(@CurrentUser() user: any) {
    return this.authService.getCurrentUser(user.uid);
  }

  @Get("/health")
  health() {
    return { status: "ok", service: "auth" };
  }
}
