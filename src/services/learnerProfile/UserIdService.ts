
// User ID Service

export class UserIdService {
  getCurrentUserId(): string {
    return 'mock-user-12345';
  }
}

export const userIdService = new UserIdService();
