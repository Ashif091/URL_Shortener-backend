import { Controller, Post, Body, UseGuards, Request, UnauthorizedException, Res, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto,@Res({ passthrough: true }) res: Response) {
    const { email, password, name } = registerDto;
    const user = await this.authService.register(email, password, name);
    return res
    .status(200)
    .json( { message: 'User registered successfully', user });
  }
 
  @Post('login')
  async login(@Body() loginDto: LoginDto,@Res({ passthrough: true }) res: Response) {
    const { email, password } = loginDto;
    try {
      const { accessToken ,user } = await this.authService.login(email, password);
      res.cookie('accessToken', accessToken, {
        httpOnly: false, 
        secure: true, 
        maxAge: 24*60 * 60 * 1000,
      });
      return res
      .status(200)
      .json( { message: 'Login successful', accessToken ,user})
    } catch (error) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }
}
