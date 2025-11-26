import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from 'src/schemas/user.schema';

@Injectable()
export class EmployerApprovalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role === UserRole.EMPLOYER && !user.isEmployerApproved) {
      throw new ForbiddenException(
        'Your employer account is pending approval. Please wait for admin approval.',
      );
    }

    return true;
  }
}
