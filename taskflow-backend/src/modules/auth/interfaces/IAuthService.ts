export interface IAuthService {
  verifyToken(token: string): Promise<{ uid: string; email: string }>;
  getCurrentUser(uid: string): Promise<any>;
}
