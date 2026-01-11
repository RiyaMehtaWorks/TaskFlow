var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { JsonController, Get, Authorized, CurrentUser, } from "routing-controllers";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../types.js";
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async getCurrentUser(user) {
        return this.authService.getCurrentUser(user.uid);
    }
    health() {
        return { status: "ok", service: "auth" };
    }
};
__decorate([
    Get("/me"),
    Authorized(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    Get("/health"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "health", null);
AuthController = __decorate([
    injectable(),
    JsonController("/auth"),
    __param(0, inject(AUTH_TYPES.AuthService)),
    __metadata("design:paramtypes", [Object])
], AuthController);
export { AuthController };
