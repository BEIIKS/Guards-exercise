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

  // Helper to mock chainable Mongoose queries (method -> select -> exec)
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
    it('should split new and existing URLs and emit events for all', async () => {
      const inputDto = {
        urls: ['http://new.com', 'http://old.com', 'http://new.com'],
      }; // Duplicate in input

      const existingDoc = { _id: 'old_id', url: 'http://old.com' };
      const newDoc = { _id: 'new_id', url: 'http://new.com' };

      // Mock Setup
      // 1. find returns existing
      mockQueryChain(mockUrlModel.find, [existingDoc]);

      // 2. insertMany returns new
      mockUrlModel.insertMany.mockResolvedValue([newDoc]);

      await service.handleUrlsSubmit(inputDto);

      // Verify deduplication and separation
      expect(mockUrlModel.find).toHaveBeenCalledWith({
        url: { $in: ['http://new.com', 'http://old.com'] },
      });

      // Verify insertion of strictly new URL
      expect(mockUrlModel.insertMany).toHaveBeenCalledWith([
        { url: 'http://new.com' },
      ]);

      // Verify emission includes both (allUnique)
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
