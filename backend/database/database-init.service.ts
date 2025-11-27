import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../src/schemas/user.schema';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    try {
      // Check if any admin user exists
      const adminExists = await this.userModel.findOne({
        role: UserRole.ADMIN,
      });

      if (adminExists) {
        this.logger.log('Admin user already exists. Skipping creation.');
        return;
      }

      // Create default admin user
      const defaultAdminEmail =
        process.env.DEFAULT_ADMIN_EMAIL || 'admin@jobportal.com';
      const defaultAdminPassword =
        process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123';
      const defaultAdminName = process.env.DEFAULT_ADMIN_NAME || 'System Admin';

      const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10);

      const admin = new this.userModel({
        name: defaultAdminName,
        email: defaultAdminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
        isEmployerApproved: true,
        isBlocked: false,
      });

      await admin.save();

      console.log('Default admin user created successfully!');
      console.log(`Email: ${defaultAdminEmail}`);
      console.log(`Password: ${defaultAdminPassword}`);
      console.log(
        'Please change the default admin password after first login!',
      );
    } catch (error) {
      this.logger.error('Failed to create default admin user:', error.message);
    }
  }
}
