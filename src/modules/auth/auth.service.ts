import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { authValidate } from '../../utils/validateAuth';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private jwtService: JwtService) {}

  async login(authDto: AuthDto) {
    try {
      const user = await this.validateAuth(authDto);
      if (user) {
        const payload = {
          ...user,
        };

        return {
          access_token: this.jwtService.sign(payload),
        };
      }
    } catch (error) {
      this.logger.error(`Error no auth: ${error}`);
    }
  }

  async validateAuth(authDto: AuthDto): Promise<object> {
    this.logger.log('Check Validate auth');
    const { code, date } = authDto;
    // TODO:DIFERENCIA DE FECHAS
    // Encripta y encuentra el usuario del json;
    const cryptCode = await bcrypt.hash(String(code), 8);
    const searchUser = authValidate.find((auth) => auth.id === cryptCode);
    if (!searchUser) {
      return null;
    }
    return searchUser;
  }
}
