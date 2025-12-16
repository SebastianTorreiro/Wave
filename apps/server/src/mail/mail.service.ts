import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import { appConfig } from '../app/app.config';
import { ConfigType } from '@nestjs/config';
import { InjectRedis } from '@songkeys/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor(
    @Inject(appConfig.KEY) { mail }: ConfigType<typeof appConfig>,
    @InjectRedis() private readonly redis: Redis
  ) {
    this.transporter = createTransport({
      secure: false,
      host: mail.host,
      port: mail.port,
      auth: {
        user: mail.user,
        pass: mail.password,
      },
    });
  }

  async sendVerificationCode(to: string): Promise<string | null> {
    try {
      const code = this.generateRandomCode();

      await this.transporter.sendMail({
        to,
        from: 'support@wave.com',
        subject: 'Verification Code',
        text: `Welcome to wave! Here is your verification code: ${code}`,
      });
      await this.redis.set(to, code);
      console.log(code);
      return code.toString();
    } catch (e: unknown) {
      if (e instanceof Error)
        throw new InternalServerErrorException(
          `Unable to send mail: ${e.message}`
        );
      else throw e;
    }
  }

  async checkVerificationCode(email: string, code: string): Promise<boolean> {
    const actualCode = await this.redis.get(email);

    if (!!actualCode && actualCode === code) {
      this.redis.del(email);
      return true;
    }

    return false;
  }

  private generateRandomCode(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }
}
