import { Request } from 'express';

export type AuthenticatedUser = {
  id: number;
  firebaseId: string;
  email: string;
  globalRole: string;
  careersUser?: {
    role: string;
  };
};

export interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
}
