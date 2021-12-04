import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login in the api',
    description: 'Login in the api',
  })
  @Post('/login')
  async loginUser(@Body() authDto: AuthDto, @Res() res: any) {
    try {
      const auth = await this.authService.login(authDto);
      if (!auth) {
        return res.status(HttpStatus.OK).send({ message: 'auth no correct' });
      }
      this.logger.log(`login correct`);
      return res.status(HttpStatus.OK).send(auth);
    } catch (error) {
      this.logger.error(`auth error ${error}`);
      return res.status(HttpStatus.BAD_GATEWAY).send(error);
    }
  }
}
