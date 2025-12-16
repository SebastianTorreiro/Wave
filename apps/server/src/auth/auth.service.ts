import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthResponseDto, CreateUserDto, LoginDto } from '@dto';
import { MailService } from '../mail/mail.service';
import { compareSync } from 'bcrypt';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@timonmasberg/automapper-nestjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    @InjectMapper()
    private readonly mapper: Mapper
  ) {}

  async register(createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
    // await this.mailService.sendVerificationCode(createUserDto.email);

    return {
      message: `An email has been sent to ${createUserDto.email}, please check your inbox`,
    };
  }

  async checkVerificationCode(
    email: string,
    code: string
  ): Promise<AuthResponseDto> {
    const matchingCode = await this.mailService.checkVerificationCode(
      email,
      code
    );

    if (!matchingCode)
      throw new BadRequestException("Verification code doesn't match");

    const user = await this.userService.confirmVerify(email);

    if (!user)
      throw new InternalServerErrorException(
        `Unable to retrieve user with email "${email}" from database`
      );

    return {
      user,
      access_token: await this.jwtService.signAsync({ email }),
    };
  }

  async login(credentials: LoginDto): Promise<AuthResponseDto> {
    const userDoc = await this.userService.isRegistered(credentials.email);

    if (
      !userDoc ||
      !this.comparePasswords(credentials.password, userDoc.passwordHash)
    )
      throw new BadRequestException('Invalid email or password');

    return {
      user: this.mapper.map(userDoc, 'UserDocument', 'UserDto'),
      access_token: await this.jwtService.signAsync({
        email: credentials.email,
      }),
    };
  }

  private comparePasswords(plain: string, hashed: string): boolean {
    return compareSync(plain, hashed);
  }
}
