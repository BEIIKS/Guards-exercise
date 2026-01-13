import { Test, TestingModule } from '@nestjs/testing';
import { UrlsApiGatewayService } from './urls-api-gateway.service';
import { getModelToken } from '@nestjs/mongoose';
import { Url, UrlStatus } from '@libs/schemas';
import { MessagingService, TOPICS } from '@libs/messaging';
import { NotFoundException } from '@nestjs/common';

describe('UrlsApiGatewayService', () => {
  let service: UrlsApiGatewayService;
  let messagingService: MessagingService;
  let urlModel: any;

  const mockUrlModel = {
    find: jest.fn(),
    insertMany: jest.fn(),
    findById: jest.fn(),
  };

  const mockMessagingService = {
    emitMany: jest.fn(),
  };

  const mockQueryChain = (method: jest.Mock, result: any) => {
    method.mockReturnValue({
      select: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(result),
      }),
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsApiGatewayService,
        {
          provide: getModelToken(Url.name),
          useValue: mockUrlModel,
        },
        {
          provide: MessagingService,
          useValue: mockMessagingService,
        },
      ],
    }).compile();

    service = module.get<UrlsApiGatewayService>(UrlsApiGatewayService);
    messagingService = module.get<MessagingService>(MessagingService);
    urlModel = module.get(getModelToken(Url.name));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleUrlsSubmit', () => {
    it('should insert all new URLs', async () => {
      const inputDto = { urls: ['http://new1.com', 'http://new2.com'] };
      mockQueryChain(mockUrlModel.find, []);
      mockUrlModel.insertMany.mockResolvedValue([
        { _id: '1', url: 'http://new1.com' },
        { _id: '2', url: 'http://new2.com' },
      ]);

      await service.handleUrlsSubmit(inputDto);

      expect(mockUrlModel.insertMany).toHaveBeenCalledWith([
        { url: 'http://new1.com' },
        { url: 'http://new2.com' },
      ]);
      expect(messagingService.emitMany).toHaveBeenCalledWith(TOPICS.URL_FETCH, [
        { key: '1', value: { url: 'http://new1.com' } },
        { key: '2', value: { url: 'http://new2.com' } },
      ]);
    });

    it('should defined existing URLs and not insert them', async () => {
      const inputDto = { urls: ['http://existing.com'] };
      mockQueryChain(mockUrlModel.find, [
        { _id: '1', url: 'http://existing.com' },
      ]);

      await service.handleUrlsSubmit(inputDto);

      expect(mockUrlModel.insertMany).not.toHaveBeenCalled();
      expect(messagingService.emitMany).toHaveBeenCalledWith(TOPICS.URL_FETCH, [
        { key: '1', value: { url: 'http://existing.com' } },
      ]);
    });

    it('should handle mixed new and existing URLs', async () => {
      const inputDto = {
        urls: ['http://new.com', 'http://old.com'],
      };

      const existingDoc = { _id: 'old_id', url: 'http://old.com' };
      const newDoc = { _id: 'new_id', url: 'http://new.com' };

      mockQueryChain(mockUrlModel.find, [existingDoc]);
      mockUrlModel.insertMany.mockResolvedValue([newDoc]);

      await service.handleUrlsSubmit(inputDto);

      expect(mockUrlModel.insertMany).toHaveBeenCalledWith([
        { url: 'http://new.com' },
      ]);
      expect(messagingService.emitMany).toHaveBeenCalledWith(TOPICS.URL_FETCH, [
        { key: 'old_id', value: { url: 'http://old.com' } },
        { key: 'new_id', value: { url: 'http://new.com' } },
      ]);
    });
  });

  describe('findAll', () => {
    it('should return urls with selected fields', async () => {
      const mockRes = [
        { url: 'abc', status: 'pending', updatedAt: new Date() },
      ];
      mockQueryChain(mockUrlModel.find, mockRes);

      const result = await service.findAll();
      expect(result).toEqual(mockRes);
      expect(mockUrlModel.find).toHaveBeenCalled();
    });
  });

  describe('findContentById', () => {
    it('should return content if found', async () => {
      const mockDoc = { content: '<html></html>' };
      mockQueryChain(mockUrlModel.findById, mockDoc);

      const result = await service.findContentById('id1');
      expect(result).toEqual(mockDoc);
    });

    it('should throw NotFoundException if not found', async () => {
      mockQueryChain(mockUrlModel.findById, null);
      await expect(service.findContentById('bad_id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
