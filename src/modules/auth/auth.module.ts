import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StrategyService } from './strategy/strategy.service';
import { AuthGuardService } from './auth-guard/auth-guard.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: '2897498278789273',
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [StrategyService, AuthGuardService, AuthService],
  exports: [StrategyService, AuthGuardService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
