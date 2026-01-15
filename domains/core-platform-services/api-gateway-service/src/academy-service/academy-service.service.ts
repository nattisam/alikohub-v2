// academy-service.service.ts
// Handles business logic for the Academy Service integration.
import { Injectable } from '@nestjs/common';

@Injectable()
export class AcademyServiceService {
  getStatus() {
    return { status: 'Academy Service is reachable via API Gateway' };
  }
}
