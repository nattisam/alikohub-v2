import { Request } from 'express';

export type AuthenticatedUser = {
  firebaseId: string;
  globalRole: 'USER' | 'ADMIN';
};

export interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
}
