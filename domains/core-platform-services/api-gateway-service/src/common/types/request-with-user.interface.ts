import { Request } from 'express';

export type AuthenticatedUser = {
  id: number;
  firebaseId: string;
  email: string;
  globalRole: string;
  careersUser?: {
    role: string;
  };
  careersRole?: string;
  careersStatus?: string;
};

export interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
}
