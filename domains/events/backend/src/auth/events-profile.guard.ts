import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class EventsProfileGuard implements CanActivate {
  constructor(private userService: UserService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToRpc().getData();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('No user found in request');
    }

    // Ensure user has Events profile
    try {
      const profile = await this.userService.getOrCreateProfile(user);
      request.eventsProfile = profile;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Failed to get Events profile');
    }
  }
}
