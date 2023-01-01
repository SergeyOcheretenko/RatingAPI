import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { connect, Types } from 'mongoose';
import { CreateFeedbackDto } from '../../../src/feedback/dto/create-feedback.dto';
import { FeedbackService } from '../../../src/feedback/feedback.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Feedback,
  FeedbackSchema,
} from '../../../src/feedback/schema/feedback.schema';

jest.mock('../../mocks/feedback/schema/feedback.schema.mock');

describe('FeedbackService (unit)', () => {
  let app: INestApplication;
  let feedbackService: FeedbackService;
  let feedbacksCollection: any;
  let mongoConnection: any;
  let mongoServer: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri,
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }),
        }),
        MongooseModule.forFeature([
          { name: Feedback.name, schema: FeedbackSchema },
        ]),
      ],
      providers: [FeedbackService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    mongoConnection = (await connect(uri)).connection;
    feedbacksCollection = mongoConnection.db.collection('feedbacks');

    feedbackService = moduleFixture.get<FeedbackService>(FeedbackService);

    await feedbacksCollection.deleteMany({});
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await feedbacksCollection.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongoServer.stop();
  });

  const CREATE_FEEDBACK_1: CreateFeedbackDto & { _id } = {
    _id: new Types.ObjectId(),
    name: 'Name',
    title: 'Title',
    description: 'Description',
    rating: 4.3,
    productId: new Types.ObjectId().toString(),
  };

  const CREATE_FEEDBACK_2: CreateFeedbackDto & { _id } = {
    ...CREATE_FEEDBACK_1,
    productId: new Types.ObjectId().toString(),
    _id: new Types.ObjectId(),
  };

  const FEEDBACK_1 = {
    ...CREATE_FEEDBACK_1,
    productId: new Types.ObjectId(CREATE_FEEDBACK_1.productId),
  };

  const FEEDBACK_2 = {
    ...CREATE_FEEDBACK_2,
    productId: new Types.ObjectId(CREATE_FEEDBACK_2.productId),
  };

  describe('.create() method tests', () => {
    it('Should create a feedback and save it', async () => {
      const result = await feedbackService.create(CREATE_FEEDBACK_1);

      const feedback = await feedbacksCollection.findOne({
        _id: FEEDBACK_1._id,
      });
      expect(result).toMatchObject(FEEDBACK_1);
      expect(feedback).toMatchObject(FEEDBACK_1);
    });
  });

  describe('.delete() method tests', () => {
    beforeEach(async () => {
      await feedbacksCollection.insertMany([FEEDBACK_1, FEEDBACK_2]);
    });

    it('Should delete feedback', async () => {
      const result = await feedbackService.delete(CREATE_FEEDBACK_1._id);

      const existingFeedbacks = await feedbacksCollection.find().toArray();
      expect(result).toMatchObject(FEEDBACK_1);
      expect(existingFeedbacks).toBeInstanceOf(Array);
      expect(existingFeedbacks).toHaveLength(1);
      expect(existingFeedbacks[0]).toMatchObject(FEEDBACK_2);
    });

    it('Should return null when feedback not found', async () => {
      await feedbacksCollection.deleteOne({ _id: FEEDBACK_1._id });

      const result = await feedbackService.delete(CREATE_FEEDBACK_1._id);

      const existingFeedbacks = await feedbacksCollection.find().toArray();
      expect(result).toEqual(null);
      expect(existingFeedbacks).toBeInstanceOf(Array);
      expect(existingFeedbacks).toHaveLength(1);
      expect(existingFeedbacks[0]).toMatchObject(FEEDBACK_2);
    });
  });

  describe('.getAll() method tests', () => {
    beforeEach(async () => {
      await feedbacksCollection.insertMany([FEEDBACK_1, FEEDBACK_2]);
    });

    it('Should return all feedbacks', async () => {
      const result = await feedbackService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject(FEEDBACK_1);
      expect(result[1]).toMatchObject(FEEDBACK_2);
    });

    it('Should call return empty array when there are no feedbacks', async () => {
      await feedbacksCollection.deleteMany({});

      const result = await feedbackService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });
  });

  describe('.findByProductId() method tests', () => {
    beforeEach(async () => {
      await feedbacksCollection.insertMany([FEEDBACK_1, FEEDBACK_2]);
    });

    it('Should return feedbacks by product id', async () => {
      const result = await feedbackService.findByProductId(
        CREATE_FEEDBACK_1.productId,
      );

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(FEEDBACK_1);
    });

    it('Should return empty array when there are no feedbacks with this product id', async () => {
      await feedbacksCollection.deleteMany({
        productId: FEEDBACK_1.productId,
      });

      const result = await feedbackService.findByProductId(
        CREATE_FEEDBACK_1.productId,
      );

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });
  });

  describe('.deleteByProductId() method tests', () => {
    beforeEach(async () => {
      await feedbacksCollection.insertMany([FEEDBACK_1, FEEDBACK_2]);
    });

    it('Should delete product with received product id', async () => {
      await feedbackService.deleteByProductId(CREATE_FEEDBACK_1.productId);

      const existingFeedbacks = await feedbacksCollection.find().toArray();
      expect(existingFeedbacks).toBeInstanceOf(Array);
      expect(existingFeedbacks).toHaveLength(1);
      expect(existingFeedbacks[0]).toMatchObject(FEEDBACK_2);
    });
  });
});
