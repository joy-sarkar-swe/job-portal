import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Application,
  ApplicationDocument,
} from '../schemas/application.schema';
import { User, UserDocument, UserRole } from '../schemas/user.schema';
import { AppliedJobsPaginationDto } from './dto/applied-jobs.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      statusCode: 200,
      message: 'User profile retrieved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        resumeUrl: user.resumeUrl,
        isEmployerApproved: user.isEmployerApproved,
        isBlocked: user.isBlocked,
      },
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.JOBSEEKER) {
      throw new NotFoundException('Only job seekers can update their profile');
    }

    const { bio, skills, resumeUrl } = updateProfileDto;

    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;

    await user.save();

    return {
      statusCode: 200,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        resumeUrl: user.resumeUrl,
      },
    };
  }

  async getAppliedJobs(userId: string, query: AppliedJobsPaginationDto) {
    const { page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.applicationModel
        .find({ jobseeker: userId })
        .populate({
          path: 'job',
          select:
            'title company location jobType salaryRange description employer',
          populate: {
            path: 'employer',
            select: 'name email',
          },
        })
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(limit),
      this.applicationModel.countDocuments({ jobseeker: userId }),
    ]);

    return {
      statusCode: 200,
      message: 'Applied jobs retrieved successfully',
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: data.map((app) => ({
        applicationId: app._id,
        appliedAt: app.appliedAt,
        job: app.job,
      })),
    };
  }
}
