import { Request } from 'express';
import { Role, User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
          id: number;
          name: string;
          email: string;
          role : Role
          createAt: Date;
          updatedAt: Date;
        } | null;
}
