import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'home-service' };
  }
}

@Controller()
export class AppController {
  @Get()
  getHello() {
    return { message: 'Welcome to AlikoHub Home Service' };
  }
}
