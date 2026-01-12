import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CaptchaService {
  private readonly logger = new Logger(CaptchaService.name);
  private readonly secretKey: string | undefined;
  private readonly verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
    
    if (!this.secretKey) {
      this.logger.warn('RECAPTCHA_SECRET_KEY not configured. CAPTCHA validation will be skipped.');
    } else {
      this.logger.log('reCAPTCHA validation enabled');
    }
  }

  /**
   * Verify a reCAPTCHA token
   * @param token The reCAPTCHA token from the client
   * @returns true if valid, false if invalid, or null if CAPTCHA is not configured
   */
  async verifyCaptcha(token: string | undefined): Promise<boolean | null> {
    // If CAPTCHA is not configured, skip validation
    if (!this.secretKey) {
      this.logger.debug('CAPTCHA validation skipped - not configured');
      return null;
    }

    // If no token provided when CAPTCHA is required
    if (!token) {
      this.logger.warn('CAPTCHA token missing but validation is enabled');
      return false;
    }

    try {
      const response = await fetch(this.verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: this.secretKey,
          response: token,
        }),
      });

      const data = await response.json() as { success: boolean; score?: number; 'error-codes'?: string[] };

      if (data.success) {
        this.logger.log('CAPTCHA verification successful');
        // For reCAPTCHA v3, you might also want to check the score
        if (data.score !== undefined && data.score < 0.5) {
          this.logger.warn(`CAPTCHA score too low: ${data.score}`);
          return false;
        }
        return true;
      } else {
        this.logger.warn(`CAPTCHA verification failed: ${data['error-codes']?.join(', ')}`);
        return false;
      }
    } catch (error: any) {
      this.logger.error(`CAPTCHA verification error: ${error.message}`);
      // In case of network errors, allow the request (fail-open)
      // You might want to change this to fail-close in high-security environments
      return null;
    }
  }
}
