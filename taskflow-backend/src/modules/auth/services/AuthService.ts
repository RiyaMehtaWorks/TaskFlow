import { injectable } from "inversify";
import { auth } from "../../../config/firebase.js";
import { IAuthService } from "../interfaces/IAuthService.js";

@injectable()
export class AuthService implements IAuthService {
  async verifyToken(token: string): Promise<{ uid: string; email: string }> {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email || "",
      };
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  async getCurrentUser(uid: string): Promise<any> {
    try {
      const userRecord = await auth.getUser(uid);
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      };
    } catch (error) {
      throw new Error("User not found");
    }
  }
}
