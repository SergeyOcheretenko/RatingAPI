import { CreateFeedbackDto } from '../../../src/modules/feedback/dto/create-feedback.dto';
import { FeedbackController } from '../../../src/modules/feedback/feedback.controller';
import { FeedbackService } from '../../../src/modules/feedback/feedback.service';
import { MockFeedbackService } from '../../mocks/feedback/feedback.service.mock';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FEEDBACK_NOT_FOUND_MESSAGE } from '../../../src/modules/feedback/feedback.constants';

describe('FeedbackController (unit)', () => {
  let feedbackController: FeedbackController;
  let feedbackService: FeedbackService;

  beforeAll(() => {
    feedbackService = new MockFeedbackService() as unknown as FeedbackService;
    feedbackController = new FeedbackController(feedbackService, null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('.create() method tests', () => {
    const BODY: CreateFeedbackDto = {
      name: 'Name',
      title: 'Title',
      description: 'Description',
      rating: 4.3,
      productId: '4eb6e7e7e9b7f4194e000001',
    };

    const RESPONSE_FROM_FEEDBACK_SERVICE = 'Response from feedback service';

    beforeEach(() => {
      feedbackService.create = jest
        .fn()
        .mockResolvedValue(RESPONSE_FROM_FEEDBACK_SERVICE);
      // feedbackService.notify = jest.fn();
    });

    it('Should call .create() method from FeedbackService', async () => {
      const result = await feedbackController.create(BODY);

      expect(feedbackService.create).toHaveBeenCalledWith(BODY);
      // expect(feedbackService.notify).toHaveBeenCalledWith(BODY);
      expect(result).toEqual(RESPONSE_FROM_FEEDBACK_SERVICE);
    });
  });

  describe('.getAll() method tests', () => {
    const RESPONSE_FROM_FEEDBACK_SERVICE = 'Response from feedback service';

    beforeEach(() => {
      feedbackService.getAll = jest
        .fn()
        .mockResolvedValue(RESPONSE_FROM_FEEDBACK_SERVICE);
    });

    it('Should call .getAll() method from FeedbackService', async () => {
      const result = await feedbackController.getAll();

      expect(feedbackService.getAll).toHaveBeenCalledWith();
      expect(result).toEqual(RESPONSE_FROM_FEEDBACK_SERVICE);
    });
  });

  describe('.getByProduct() method tests', () => {
    const PRODUCT_ID = '4eb6e7e7e9b7f4194e000001';

    const RESPONSE_FROM_FEEDBACK_SERVICE = 'Response from feedback service';

    beforeEach(() => {
      feedbackService.findByProductId = jest
        .fn()
        .mockResolvedValue(RESPONSE_FROM_FEEDBACK_SERVICE);
    });

    it('Should call .findByProductId() method from FeedbackService', async () => {
      const result = await feedbackController.getByProduct(PRODUCT_ID);

      expect(feedbackService.findByProductId).toHaveBeenCalledWith(PRODUCT_ID);
      expect(result).toEqual(RESPONSE_FROM_FEEDBACK_SERVICE);
    });
  });

  describe('.delete() method tests', () => {
    const ID = '4eb6e7e7e9b7f4194e000001';

    const RESPONSE_FROM_FEEDBACK_SERVICE = 'Response from feedback service';

    beforeEach(() => {
      feedbackService.delete = jest
        .fn()
        .mockResolvedValue(RESPONSE_FROM_FEEDBACK_SERVICE);
    });

    it('Should call .delete() method from FeedbackService and return deleted feedback', async () => {
      const result = await feedbackController.delete(ID);

      expect(feedbackService.delete).toHaveBeenCalledWith(ID);
      expect(result).toEqual(RESPONSE_FROM_FEEDBACK_SERVICE);
    });

    it('Should throw NOT_FOUND exception when no feeback was deleted ', async () => {
      feedbackService.delete = jest.fn().mockResolvedValue(null);

      expect(
        async () => await feedbackController.delete(ID),
      ).rejects.toThrowError(
        new HttpException(FEEDBACK_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND),
      );

      expect(feedbackService.delete).toHaveBeenCalledWith(ID);
    });
  });

  describe('.deleteByProduct() method tests', () => {
    const PRODUCT_ID = '4eb6e7e7e9b7f4194e000001';

    const RESPONSE_FROM_FEEDBACK_SERVICE = 'Response from feedback service';

    beforeEach(() => {
      feedbackService.deleteByProductId = jest
        .fn()
        .mockResolvedValue(RESPONSE_FROM_FEEDBACK_SERVICE);
    });

    it('Should call .deleteByProductId() method from FeedbackService', async () => {
      const result = await feedbackController.deleteByProduct(PRODUCT_ID);

      expect(feedbackService.deleteByProductId).toHaveBeenCalledWith(
        PRODUCT_ID,
      );
      expect(result).toEqual(RESPONSE_FROM_FEEDBACK_SERVICE);
    });
  });
});
