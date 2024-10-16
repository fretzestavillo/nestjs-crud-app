import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    console.log('logging in AuthService');
    return this.userRepository.createUser(authCredentialsDto);
  }

  signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; id: string; myname: string }> {
    return this.userRepository.signIn(authCredentialsDto);
  }
}
