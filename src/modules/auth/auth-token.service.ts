import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

interface AuthTokenServiceConfig {
  jwtAccessToken: { secret: string; expiresIn: string };
}

@Injectable()
export class AuthTokenService {
  private readonly config: AuthTokenServiceConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.config = {
      jwtAccessToken: {
        secret: this.configService.get('JWT_ACCESS_TOKEN'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION'),
      },
    };
  }

  generateAccessToken(id: number): string {
    const payload = { id };
    const token = this.jwtService.sign(payload, this.config.jwtAccessToken);

    return token;
  }
}
