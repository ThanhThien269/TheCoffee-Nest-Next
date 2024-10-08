import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalAuthGuard } from './passport/guards/local-auth.guard';
import { Public, ResponseMessage } from './decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { RefreshJwtAuthGuard } from './passport/guards/refresh-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Fetch login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('mail')
  @Public()
  testMail() {
    this.mailerService.sendMail({
      to: 'thanhthien34c9@gmail.com',
      subject: 'Testing Nest MailerModule ✔',
      text: 'welcome',
      template: 'register',
      context: {
        name: 'Thien',
        activationCode: 123456,
      },
    });
    return 'ok';
  }

  @Post('register')
  @Public()
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }
  @Post('check-code')
  @Public()
  checkCode(@Body() codeAuthDto: CodeAuthDto) {
    return this.authService.checkCode(codeAuthDto);
  }
  @UseGuards(RefreshJwtAuthGuard)
  @Public()
  @Post('refresh')
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
