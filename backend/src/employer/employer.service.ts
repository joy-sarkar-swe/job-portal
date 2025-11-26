import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../schemas/user.schema';

@Injectable()
export class EmployerService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getStatus(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.EMPLOYER) {
      throw new NotFoundException('Only employers can check their status');
    }

    return {
      statusCode: 200,
      status: user.isEmployerApproved ? 'approved' : 'pending',
      message: user.isEmployerApproved
        ? 'Your employer account is approved'
        : 'Your employer account is pending approval',
    };
  }
}
