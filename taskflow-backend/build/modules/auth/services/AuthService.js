var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from "inversify";
import { auth } from "../../../config/firebase.js";
let AuthService = class AuthService {
    async verifyToken(token) {
        try {
            const decodedToken = await auth.verifyIdToken(token);
            return {
                uid: decodedToken.uid,
                email: decodedToken.email || "",
            };
        }
        catch (error) {
            throw new Error("Invalid token");
        }
    }
    async getCurrentUser(uid) {
        try {
            const userRecord = await auth.getUser(uid);
            return {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
            };
        }
        catch (error) {
            throw new Error("User not found");
        }
    }
};
AuthService = __decorate([
    injectable()
], AuthService);
export { AuthService };
