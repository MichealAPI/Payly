import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user-response.dto';
import { ConfigService } from '@nestjs/config';
import { uploadImage } from 'src/utils/upload.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    {
      const existingUser = await this.userModel
        .findOne({ email: createUserDto.email })
        .exec();
      if (existingUser) {
        throw new ConflictException('A user with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();

      const { password, __v, ...result } = savedUser.toObject();
      return result;
    }
  }

  async getUserSettings(
    currentUser: User,
    setting: string | null,
  ): Promise<any> {
    const user = await this.userModel
      .findById(currentUser._id)
      .select('settings')
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (setting) {
      const userSetting = user.settings.find((s) => s.key === setting);

      if (!userSetting) {
        throw new NotFoundException(`Setting ${setting} not found for user`);
      }

      return userSetting;
    }

    return user.settings;
  }

  async updateUserSettings(
    currentUser: User,
    updates: any,
    file?: Express.Multer.File,
  ): Promise<any> {
    const user = await this.userModel.findById(currentUser._id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updates.firstName) user.firstName = updates.firstName;
    if (updates.lastName) user.lastName = updates.lastName;
    if (updates.email) user.email = updates.email;
    if (updates.password)
      user.password = await bcrypt.hash(updates.password, 10);

    // 1) If a file was uploaded, upload to Cloudinary and upsert the profilePicture setting
    if (file) {
      const { publicId, version } = await uploadImage(
        this.configService,
        file,
        `users/${(currentUser._id as any).toString()}`,
        'profilePicture',
      );

      if (!user.settings) user.settings = [];
      const idx = user.settings.findIndex((s) => s.key === 'profilePicture');
      if (idx > -1) user.settings[idx].value = publicId;
      else user.settings.push({ key: 'profilePicture', value: publicId });

      // store version for cache-busting (normalize to number)
      const vIdx = user.settings.findIndex(
        (s) => s.key === 'profilePictureVersion',
      );
      const v = Number(version);
      if (vIdx > -1) user.settings[vIdx].value = v;
      else user.settings.push({ key: 'profilePictureVersion', value: v });
    }

    // 2) Process other settings (ignore profilePicture and any temp key)
    if (updates.settings && Array.isArray(updates.settings)) {
      const filtered = updates.settings.filter(
        (s: { key: string }) =>
          s.key !== 'profilePicture' &&
          s.key !== 'transferProfilePicture' &&
          s.key !== 'profilePictureVersion',
      );
      if (!user.settings) user.settings = [];
      filtered.forEach((settingToUpdate: { key: string; value: any }) => {
        const existingSettingIndex = user.settings.findIndex(
          (s) => s.key === settingToUpdate.key,
        );
        if (existingSettingIndex > -1) {
          user.settings[existingSettingIndex].value = settingToUpdate.value;
        } else {
          user.settings.push(settingToUpdate);
        }
      });
    }

    // ensure Mongoose sees nested mutations
    user.markModified('settings');
    await user.save();

    return {
      message: 'User settings updated successfully',
      settings: user.settings,
    };
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password -__v').exec();
  }
}
