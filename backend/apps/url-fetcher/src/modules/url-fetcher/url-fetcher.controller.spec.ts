import { Test, TestingModule } from '@nestjs/testing';
import { UrlFetcherController } from './url-fetcher.controller';
import { UrlFetcherService } from './url-fetcher.service';
import { KafkaContext } from '@nestjs/microservices';

describe('UrlFetcherController', () => {
  let controller: UrlFetcherController;
  let service: UrlFetcherService;

  const mockService = {
    processUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlFetcherController],
      providers: [
        {
          provide: UrlFetcherService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UrlFetcherController>(UrlFetcherController);
    service = module.get<UrlFetcherService>(UrlFetcherService);

    jest.clearAllMocks();
  });

  describe('handleUrlFetch', () => {
    const mockContext = {
      getMessage: jest.fn(),
    } as unknown as KafkaContext;

    it('should process url if key is present', async () => {
      const payload = { url: 'http://test.com' };

      // Mock Kafka Message with Key
      (mockContext.getMessage as jest.Mock).mockReturnValue({
        key: Buffer.from('mongoId'),
        value: payload,
      });

      await controller.handleUrlFetch(payload, mockContext);

      expect(service.processUrl).toHaveBeenCalledWith(
        'mongoId',
        'http://test.com',
      );
    });

    it('should not process if key is missing', async () => {
      const payload = { url: 'http://test.com' };

      // Mock Kafka Message without Key
      (mockContext.getMessage as jest.Mock).mockReturnValue({
        key: null,
        value: payload,
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await controller.handleUrlFetch(payload, mockContext);

      expect(service.processUrl).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
