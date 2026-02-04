import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check overall system health' })
  check() {
    return this.health.check([
      () => ({ gateway: { status: 'up' } }),
      async () => {
        try {
          const result = await lastValueFrom(this.authClient.send({ cmd: 'health_check' }, {}).pipe(timeout(2000)));
          return { authService: result };
        } catch (e: any) {
          return { authService: { status: 'down', error: e.message } };
        }
      },
    ]);
  }

  @Get('ready')
  @ApiOperation({ summary: 'Check if the gateway is ready to receive traffic' })
  ready() {
    return { status: 'ready' };
  }
}
