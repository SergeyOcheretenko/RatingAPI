import { Model, Types } from 'mongoose';
import { CreateFeedbackDto } from '../../../src/feedback/dto/create-feedback.dto';
import { FeedbackService } from '../../../src/feedback/feedback.service';
import { FeedbackDocument } from '../../../src/feedback/schema/feedback.schema';
import { MockFeedbackModel } from '../../mocks/feedback/schema/feedback.schema.mock';

jest.mock('../../mocks/feedback/schema/feedback.schema.mock');

describe('FeedbackService tests', () => {
  let feedbackService: FeedbackService;
  let feedbackModel: Model<FeedbackDocument>;

  beforeAll(() => {
    feedbackModel = MockFeedbackModel as unknown as Model<FeedbackDocument>;

    feedbackService = new FeedbackService(feedbackModel);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('.create() method tests', () => {
    const RESPONSE_AFTER_SAVE = 'Response after save';

    const FEEDBACK_DATA: CreateFeedbackDto = {
      name: 'Name',
      title: 'Title',
      description: 'Description',
      rating: 4.3,
      productId: '4eb6e7e7e9b7f4194e000001',
    };

    beforeEach(() => {
      feedbackModel.prototype.save = jest
        .fn()
        .mockResolvedValue(RESPONSE_AFTER_SAVE);
    });

    it('Should create an instance of model and save it', async () => {
      const result = await feedbackService.create(FEEDBACK_DATA);

      expect(MockFeedbackModel).toHaveBeenCalledWith({
        ...FEEDBACK_DATA,
        productId: new Types.ObjectId(FEEDBACK_DATA.productId),
      });
    });
  });

  describe('.delete() method tests', () => {
    const ID = '4eb6e7e7e9b7f4194e000001';

    const RESPONSE_FROM_MODEL = 'Response from model';

    beforeEach(() => {
      feedbackModel.findByIdAndDelete = jest
        .fn()
        .mockResolvedValue(RESPONSE_FROM_MODEL);
    });

    it('Should call .findByIdAndDelete() method from model', async () => {
      const result = await feedbackService.delete(ID);

      expect(feedbackModel.findByIdAndDelete).toHaveBeenCalledWith(ID);
      expect(result).toEqual(RESPONSE_FROM_MODEL);
    });
  });

  describe('.getAll() method tests', () => {
    const RESPONSE_FROM_MODEL = 'Response from model';

    beforeEach(() => {
      feedbackModel.find = jest.fn().mockResolvedValue(RESPONSE_FROM_MODEL);
    });

    it('Should call .find() method from model', async () => {
      const result = await feedbackService.getAll();

      expect(feedbackModel.find).toHaveBeenCalledWith();
      expect(result).toEqual(RESPONSE_FROM_MODEL);
    });
  });

  describe('.findByProductId() method tests', () => {
    const PRODUCT_ID = '4eb6e7e7e9b7f4194e000001';

    const RESPONSE_FROM_MODEL = 'Response from model';

    beforeEach(() => {
      feedbackModel.find = jest.fn().mockResolvedValue(RESPONSE_FROM_MODEL);
    });

    it('Should call .find() method with filter from model', async () => {
      const result = await feedbackService.findByProductId(PRODUCT_ID);

      expect(feedbackModel.find).toHaveBeenCalledWith({
        productId: new Types.ObjectId(PRODUCT_ID),
      });
      expect(result).toEqual(RESPONSE_FROM_MODEL);
    });
  });

  describe('.deleteByProductId() method tests', () => {
    const PRODUCT_ID = '4eb6e7e7e9b7f4194e000001';

    const RESPONSE_FROM_MODEL = 'Response from model';

    beforeEach(() => {
      feedbackModel.deleteMany = jest
        .fn()
        .mockResolvedValue(RESPONSE_FROM_MODEL);
    });

    it('Should call .find() method with filter from model', async () => {
      const result = await feedbackService.deleteByProductId(PRODUCT_ID);

      expect(feedbackModel.deleteMany).toHaveBeenCalledWith({
        productId: new Types.ObjectId(PRODUCT_ID),
      });
      expect(result).toEqual(RESPONSE_FROM_MODEL);
    });
  });
});
