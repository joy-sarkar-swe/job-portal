import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from 'src/schemas/user.schema';

@Injectable()
export class EmployerApprovalGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Fetch the full user from DB to get latest data
    const dbUser = await this.userModel.findById(user.userId);

    if (!dbUser) {
      throw new ForbiddenException('User not found');
    }

    // Check employer approval status
    if (dbUser.role === UserRole.EMPLOYER && !dbUser.isEmployerApproved) {
      throw new ForbiddenException(
        'Your employer account is pending approval. Please wait for admin approval.',
      );
    }

    return true;
  }
}
