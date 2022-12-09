import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Collection, Connection, Types } from 'mongoose';
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

  afterAll(async () => {
    await feedbacksCollection.deleteMany({});
    await app.close();
  });

  describe('/create (POST)', () => {
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
});
