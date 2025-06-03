import { Test, TestingModule } from '@nestjs/testing';
import { CalendarService } from './calendar.service';
import { UserService } from '@app/user/user.service';
import { EventsService } from '@app/events/events.service';

describe('CalendarService', () => {
  let service: CalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarService,
        {
          provide: UserService,
          useValue: {
            // Mock UserService methods as needed
          },
        },
        {
          provide: EventsService,
          useValue: {
            findByGoogleEventId: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockResolvedValue('new-event-id'),
            update: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
