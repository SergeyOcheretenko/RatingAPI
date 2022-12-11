import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Collection, Connection, disconnect, Types } from 'mongoose';
import { DatabaseService } from '../src/database/database.service';
import { FeedbackService } from '../src/feedback/feedback.service';
import * as dotenv from 'dotenv';
import { Environment } from '../src/config/config.service';
import { CreateFeedbackDto } from '../src/feedback/dto/create-feedback.dto';
dotenv.config({ path: './.env' });

jest.setTimeout(60_000);

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

  describe('/feedback/create (POST)', () => {
    const BODY: CreateFeedbackDto = {
      name: 'Author name',
      title: 'Feedback title',
      description: 'Feedback description',
      rating: 4.5,
      productId: '507f191e810c19729de860ea',
    };

    beforeEach(() => {
      jest.spyOn(FeedbackService.prototype, 'create');
    });

    it('Should create new feedback', async () => {
      const response = await request(httpServer)
        .post('/feedback/create')
        .send(BODY);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(BODY);

      const createdFeedback = await feedbacksCollection.findOne({
        _id: new Types.ObjectId(response.body._id),
      });
      expect(createdFeedback).toMatchObject(BODY);
    });
  });

  describe('/feedback (GET)', () => {
    const FEEDBACK_1: CreateFeedbackDto = {
      name: 'Name 1',
      title: 'Title 1',
      description: 'Description 1',
      rating: 4.1,
      productId: '1'.repeat(24),
    };

    const FEEDBACK_2: CreateFeedbackDto = {
      name: 'Name 2',
      title: 'Title 2',
      description: 'Description 2',
      rating: 3.9,
      productId: '2'.repeat(24),
    };

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
});
