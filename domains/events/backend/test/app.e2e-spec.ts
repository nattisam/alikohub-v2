import { Test, TestingModule } from '@nestjs/testing';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppModule } from './../src/app.module';
import { EventsService } from '../src/events/events.service';
import { CreateEventDto } from '../src/events/dto/create-event.dto';

describe('EventsService (e2e)', () => {
    let eventsService: EventsService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                ClientsModule.register([
                    {
                        name: 'EVENTS_SERVICE',
                        transport: Transport.TCP,
                        options: {
                            host: 'localhost',
                            port: 3004,
                        },
                    },
                ]),
            ],
        }).compile();

        eventsService = moduleFixture.get<EventsService>(EventsService);
    });

    it('should be defined', () => {
        expect(eventsService).toBeDefined();
    });

    // Add more tests as needed
});