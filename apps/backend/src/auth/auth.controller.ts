import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
// import {  UseGuards, Req } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    console.log('logging in AuthService');
    console.log('trying to sign up');
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; id: string; myname: string }> {
    console.log('trying to login');
    return this.authService.signIn(authCredentialsDto);
  }

  //   @Post('/test')
  //   @UseGuards(AuthGuard())
  //   test(@Req() req) {
  //     console.log(req);
  //   }
}
