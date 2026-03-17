import { Controller, Get, Post, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { AuthGuard, AuthenticatedUser } from 'nest-keycloak-connect';
import { UserProfileService } from './user-profile.service';
import { UserProfile } from './entities/user-profile.entity';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getProfile(@AuthenticatedUser() user: any): Promise<UserProfile> {
    const userId = user.sub;
    return this.userProfileService.getProfile(userId);
  }

  @Post('init')
  @UseGuards(AuthGuard)
  async initOrGetProfile(@AuthenticatedUser() user: any): Promise<UserProfile> {
    const userId = user.sub;
    const profile = await this.userProfileService.getOrCreateProfile(userId, user);
    return profile;
  }

  @Put()
  @UseGuards(AuthGuard)
  async updateProfile(
    @AuthenticatedUser() user: any,
    @Body() updateData: Partial<UserProfile>,
  ): Promise<UserProfile> {
    const userId = user.sub;
    return this.userProfileService.updateProfile(userId, updateData);
  }

  @Get('system-prompt')
  @UseGuards(AuthGuard)
  async getSystemPrompt(@AuthenticatedUser() user: any): Promise<{ systemPrompt: string }> {
    const userId = user.sub;
    const profile = await this.userProfileService.getProfile(userId);
    const systemPrompt = this.userProfileService.buildSystemPrompt(profile);
    return { systemPrompt };
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteProfile(@AuthenticatedUser() user: any): Promise<{ message: string }> {
    const userId = user.sub;
    await this.userProfileService.deleteProfile(userId);
    return { message: 'Perfil eliminado correctamente' };
  }
}
