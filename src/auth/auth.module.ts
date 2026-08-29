import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthzService } from './authz.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthzService],
  exports: [AuthService, AuthzService],
})
export class AuthModule {}
