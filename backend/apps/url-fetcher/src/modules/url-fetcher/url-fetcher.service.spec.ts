import { Test, TestingModule } from '@nestjs/testing';
import { UrlFetcherService } from './url-fetcher.service';
import { getModelToken } from '@nestjs/mongoose';
import { Url, UrlStatus } from '@libs/schemas';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UrlFetcherService', () => {
  let service: UrlFetcherService;
  let urlModel: any;

  const mockUrlModel = {
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlFetcherService,
        {
          provide: getModelToken(Url.name),
          useValue: mockUrlModel,
        },
      ],
    }).compile();

    service = module.get<UrlFetcherService>(UrlFetcherService);
    urlModel = module.get(getModelToken(Url.name));

    jest.clearAllMocks();
  });

  describe('processUrl', () => {
    it('should fetch url and update status to SUCCESS', async () => {
      const url = 'http://test.com';
      const id = 'mongoId';
      const content = '<html>data</html>';

      mockedAxios.get.mockResolvedValue({ data: content });

      await service.processUrl(id, url);

      expect(mockedAxios.get).toHaveBeenCalledWith(url);
      expect(mockUrlModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          status: UrlStatus.SUCCESS,
          content: content,
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should handle error and update status to FAIL', async () => {
      const url = 'http://test.com/404';
      const id = 'mongoId';

      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      await service.processUrl(id, url);

      expect(mockedAxios.get).toHaveBeenCalledWith(url);
      expect(mockUrlModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          status: UrlStatus.FAIL,
          updatedAt: expect.any(Date),
        }),
      );
    });
  });
});
