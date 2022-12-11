import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Collection, disconnect, Types } from 'mongoose';
import { DatabaseService } from '../src/database/database.service';
import { FeedbackService } from '../src/feedback/feedback.service';
import { CreateFeedbackDto } from '../src/feedback/dto/create-feedback.dto';
import { FEEDBACK_NOT_FOUND_MESSAGE } from '../src/feedback/feedback.constants';

describe('FeedbackController (e2e)', () => {
  let app: INestApplication;
  let feedbacksCollection: Collection;
  let httpServer: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    feedbacksCollection = moduleFixture
      .get<DatabaseService>(DatabaseService)
      .getDatabaseHandle()
      .collection('feedbacks');
    httpServer = app.getHttpServer();

    await feedbacksCollection.deleteMany({});
  });

  afterEach(async () => {
    await feedbacksCollection.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });

  const FEEDBACK_1: CreateFeedbackDto = {
    name: 'Name 1',
    title: 'Title 1',
    description: 'Description 1',
    rating: 4.1,
    productId: new Types.ObjectId('1'.repeat(24)),
  };

  const FEEDBACK_2: CreateFeedbackDto = {
    name: 'Name 2',
    title: 'Title 2',
    description: 'Description 2',
    rating: 3.9,
    productId: new Types.ObjectId('2'.repeat(24)),
  };

  const FEEDBACK_3: CreateFeedbackDto = {
    name: 'Name 3',
    title: 'Title 3',
    description: 'Description 3',
    rating: 4.3,
    productId: new Types.ObjectId('2'.repeat(24)),
  };

  describe('/feedback/create (POST)', () => {
    beforeEach(() => {
      jest.spyOn(FeedbackService.prototype, 'create');
    });

    it('Should create new feedback', async () => {
      const response = await request(httpServer)
        .post('/feedback/create')
        .send(FEEDBACK_1);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(FEEDBACK_1);

      const createdFeedback = await feedbacksCollection.findOne({
        _id: new Types.ObjectId(response.body._id),
      });
      expect(createdFeedback).toMatchObject(FEEDBACK_1);
    });
  });

  describe('/feedback (GET)', () => {
    beforeEach(async () => {
      await feedbacksCollection.insertMany([FEEDBACK_1, FEEDBACK_2]);
    });

    it('Should show all feedbacks', async () => {
      const response = await request(httpServer).get('/feedback');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject(FEEDBACK_1);
      expect(response.body[1]).toMatchObject(FEEDBACK_2);
    });
  });

  describe('/feedback/byProduct/:productId (GET)', () => {
    beforeEach(async () => {
      await feedbacksCollection.insertMany([
        FEEDBACK_1,
        FEEDBACK_2,
        FEEDBACK_3,
      ]);
    });

    it('Should show all feedbacks by product id', async () => {
      const response = await request(httpServer).get(
        `/feedback/byProduct/${'2'.repeat(24)}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject(FEEDBACK_2);
      expect(response.body[1]).toMatchObject(FEEDBACK_3);
    });
  });

  describe('/feedback/:id (DELETE)', () => {
    beforeEach(async () => {
      await feedbacksCollection.insertMany([
        FEEDBACK_1,
        FEEDBACK_2,
        FEEDBACK_3,
      ]);
    });

    it('Should delete feedback by id', async () => {
      const feedback = await feedbacksCollection.findOne({
        name: FEEDBACK_1.name,
      });

      const response = await request(httpServer).delete(
        `/feedback/${feedback._id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(FEEDBACK_1);

      const existentFeedbacks = await feedbacksCollection.find().toArray();

      expect(existentFeedbacks).toHaveLength(2);
      expect(existentFeedbacks[0]).toMatchObject(FEEDBACK_2);
      expect(existentFeedbacks[1]).toMatchObject(FEEDBACK_3);
    });

    it("Should throw NOT_FOUND error when feedback doesn't exist", async () => {
      await feedbacksCollection.deleteMany({});

      const response = await request(httpServer).delete(
        `/feedback/${'1'.repeat(24)}`,
      );

      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBe(FEEDBACK_NOT_FOUND_MESSAGE);
    });
  });

  describe('/feedback/byProduct/:id (DELETE)', () => {
    beforeEach(async () => {
      await feedbacksCollection.insertMany([
        FEEDBACK_1,
        FEEDBACK_2,
        FEEDBACK_3,
      ]);
    });

    it('Should delete all feedbacks with received product id', async () => {
      const response = await request(httpServer).delete(
        `/feedback/byProduct/${'2'.repeat(24)}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.deletedCount).toBe(2);

      const existentFeedbacks = await feedbacksCollection.find().toArray();

      expect(existentFeedbacks).toHaveLength(1);
      expect(existentFeedbacks[0]).toMatchObject(FEEDBACK_1);
    });
  });
});
