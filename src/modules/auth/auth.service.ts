import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Transaction } from 'sequelize';

import { PostgresError } from '../../common/constants/postgres-error.enum';
import { UserModel } from '../users/user.model';

import { UsersService } from '../users/users.service';
import { AuthTokenService } from './auth-token.service';
import { SignInDto, TokensResponse } from './auth.dto';
import { messages } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly authTokenService: AuthTokenService,
    private readonly usersService: UsersService,
  ) {}

  private async hashPasswordOrToken(string: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedString = await bcrypt.hash(string, salt);

    return hashedString;
  }

  private async comparePasswordOrToken(
    string: string,
    hashedString: string,
  ): Promise<boolean> {
    return bcrypt.compare(string, hashedString);
  }

  async signUp(
    dto: SignInDto,
    transaction: Transaction,
  ): Promise<TokensResponse> {
    const password = await this.hashPasswordOrToken(dto.password);

    let user: UserModel;

    try {
      user = await this.usersService.createUser(
        {
          ...dto,
          password,
        },
        transaction,
      );
    } catch (error) {
      if (error.original.code === PostgresError.UniqueConstraintViolation) {
        throw new ConflictException(messages.conflictUsernameInUse);
      } else {
        throw error;
      }
    }

    const accessToken = this.authTokenService.generateAccessToken(user.id);

    return { accessToken };
  }

  async signIn(dto: SignInDto): Promise<TokensResponse> {
    const user = await this.usersService.findOne({ username: dto.username });

    if (!user) {
      throw new BadRequestException(messages.incorrectLoginCredentials);
    }

    const isPasswordSame = await this.comparePasswordOrToken(
      dto.password,
      user.password,
    );

    if (!isPasswordSame) {
      throw new BadRequestException(messages.incorrectLoginCredentials);
    }

    const accessToken = this.authTokenService.generateAccessToken(user.id);

    return { accessToken };
  }
}
