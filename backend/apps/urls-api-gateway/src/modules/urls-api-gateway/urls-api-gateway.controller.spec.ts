import { Test, TestingModule } from '@nestjs/testing';
import { UrlsApiGatewayController } from './urls-api-gateway.controller';
import { UrlsApiGatewayService } from './urls-api-gateway.service';

describe('UrlsApiGatewayController', () => {
  let controller: UrlsApiGatewayController;
  let service: UrlsApiGatewayService;

  const mockService = {
    handleUrlsSubmit: jest.fn(),
    findAll: jest.fn(),
    findContentById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsApiGatewayController],
      providers: [
        {
          provide: UrlsApiGatewayService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UrlsApiGatewayController>(UrlsApiGatewayController);
    service = module.get<UrlsApiGatewayService>(UrlsApiGatewayService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('fetchUrl (POST /url)', () => {
    it('should call handleUrlsSubmit and return status', async () => {
      const dto = { urls: ['http://test.com'] };

      const result = await controller.fetchUrl(dto);

      expect(service.handleUrlsSubmit).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ status: 'request_sent', urls: dto.urls });
    });
  });

  describe('getAllUrls (GET /url)', () => {
    it('should return result from service', async () => {
      const mockResult = [{ url: 'test', status: 'pending' }];
      mockService.findAll.mockResolvedValue(mockResult);

      const result = await controller.getAllUrls();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('getUrlContentById (GET /url/:id)', () => {
    it('should return result from service', async () => {
      const mockResult = { content: 'html' };
      mockService.findContentById.mockResolvedValue(mockResult);

      const result = await controller.getUrlContentById('123');

      expect(service.findContentById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockResult);
    });
  });
});
