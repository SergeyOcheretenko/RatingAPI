import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Collection, connect, Types } from 'mongoose';
import { ProductService } from '../../../src/modules/product/product.service';
import { ProductModule } from '../../../src/modules/product/product.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';

jest.setTimeout(60_000);

describe('ProductService (unit)', () => {
  let app: INestApplication;
  let productService: ProductService;
  let mongoConnection: any;
  let mongoServer: any;

  let productsCollection: Collection;
  let feedbacksCollection: Collection;

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
        ProductModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    mongoConnection = (await connect(uri)).connection;
    feedbacksCollection = mongoConnection.db.collection('feedbacks');
    productsCollection = mongoConnection.db.collection('products');

    productService = moduleFixture.get<ProductService>(ProductService);

    await feedbacksCollection.deleteMany({});
    await productsCollection.deleteMany({});
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await feedbacksCollection.deleteMany({});
    await productsCollection.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongoServer.stop();
  });

  const PRODUCT_1 = {
    _id: new Types.ObjectId(),
    image: 'url',
    title: 'title',
    price: 220,
    credit: 30,
    description: 'Description',
    advantages: 'nice',
    disAdvantages: 'not nice',
    categories: ['sport'],
    tags: ['sport'],
    characteristics: [{ name: 'size', value: '23' }],
  };

  const PRODUCT_2 = {
    ...PRODUCT_1,
    _id: new Types.ObjectId(),
    categories: ['courses'],
    tags: ['courses'],
  };

  const FEEDBACK_1 = {
    name: 'Feedback',
    title: 'Feedback',
    description: 'Description',
    rating: 4.5,
    productId: PRODUCT_1._id,
  };

  const FEEDBACK_2 = {
    ...FEEDBACK_1,
    rating: 4.2,
    productId: PRODUCT_1._id,
  };

  const FEEDBACK_3 = {
    ...FEEDBACK_1,
    rating: 4.2,
    productId: PRODUCT_2._id,
  };

  describe('.getAll() method tests', () => {
    beforeEach(async () => {
      await productsCollection.insertMany([PRODUCT_1, PRODUCT_2]);
      await feedbacksCollection.insertMany([
        FEEDBACK_1,
        FEEDBACK_2,
        FEEDBACK_3,
      ]);
    });

    it('Should return all products with their ratings', async () => {
      const result = await productService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        ...PRODUCT_1,
        rating: (FEEDBACK_1.rating + FEEDBACK_2.rating) / 2,
        feedbacksAmount: 2,
      });
      expect(result[1]).toMatchObject({
        ...PRODUCT_2,
        rating: FEEDBACK_3.rating,
        feedbacksAmount: 1,
      });
    });

    it('Should return all products with "rating: null" when there are no feedbacks', async () => {
      await feedbacksCollection.deleteMany({});

      const result = await productService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        ...PRODUCT_1,
        rating: null,
        feedbacksAmount: 0,
      });
      expect(result[1]).toMatchObject({
        ...PRODUCT_2,
        rating: null,
        feedbacksAmount: 0,
      });
    });

    it('Should return an empty array when there are no products', async () => {
      await productsCollection.deleteMany({});

      const result = await productService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });
  });

  describe('.getById() method tests', () => {
    beforeEach(async () => {
      await productsCollection.insertOne(PRODUCT_1);
      await feedbacksCollection.insertMany([FEEDBACK_1, FEEDBACK_2]);
    });

    it('Should return the product with its rating', async () => {
      const result = await productService.getById(PRODUCT_1._id.toHexString());

      expect(result).toMatchObject({
        ...PRODUCT_1,
        rating: (FEEDBACK_1.rating + FEEDBACK_2.rating) / 2,
        feedbacksAmount: 2,
      });
    });

    it('Should return all products with "rating: null" when there are no feedbacks', async () => {
      await feedbacksCollection.deleteMany({});

      const result = await productService.getById(PRODUCT_1._id.toHexString());

      expect(result).toMatchObject({
        ...PRODUCT_1,
        rating: null,
        feedbacksAmount: 0,
      });
    });

    it('Should return undefined when there are no product with this id', async () => {
      await productsCollection.deleteMany({});

      const result = await productService.getById(PRODUCT_1._id.toHexString());

      expect(result).toEqual(undefined);
    });
  });

  describe('.findByCategory() method tests', () => {
    const CATEGORY = 'courses';

    beforeEach(async () => {
      await productsCollection.insertMany([PRODUCT_1, PRODUCT_2]);
      await feedbacksCollection.insertMany([
        FEEDBACK_1,
        FEEDBACK_2,
        FEEDBACK_3,
      ]);
    });

    it('Should return products by received category with their ratings', async () => {
      const result = await productService.findByCategory(CATEGORY);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        ...PRODUCT_2,
        rating: FEEDBACK_3.rating,
        feedbacksAmount: 1,
      });
    });

    it('Should return products by received category with "rating: null" when there are no feedbacks', async () => {
      await feedbacksCollection.deleteMany({});

      const result = await productService.findByCategory(CATEGORY);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        ...PRODUCT_2,
        rating: null,
        feedbacksAmount: 0,
      });
    });

    it('Should return an empty array when there are no products with this category', async () => {
      await productsCollection.deleteMany({});

      const result = await productService.findByCategory(CATEGORY);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });
  });

  describe('.delete() method tests', () => {
    beforeEach(async () => {
      await productsCollection.insertMany([PRODUCT_1, PRODUCT_2]);
      await feedbacksCollection.insertMany([
        FEEDBACK_1,
        FEEDBACK_2,
        FEEDBACK_3,
      ]);
    });

    it('Should delete the product and return it', async () => {
      const result = await productService.delete(PRODUCT_1._id.toHexString());

      const existingProducts = await productsCollection.find().toArray();
      expect(existingProducts).toBeInstanceOf(Array);
      expect(existingProducts).toHaveLength(1);
      expect(existingProducts[0]).toMatchObject(PRODUCT_2);
      expect(result).toMatchObject(PRODUCT_1);
    });

    it('Should return null when product doesnt exist', async () => {
      await productsCollection.findOneAndDelete({ _id: PRODUCT_1._id });

      const result = await productService.delete(PRODUCT_1._id.toHexString());

      const existingProducts = await productsCollection.find().toArray();
      expect(existingProducts).toBeInstanceOf(Array);
      expect(existingProducts).toHaveLength(1);
      expect(existingProducts[0]).toMatchObject(PRODUCT_2);
      expect(result).toEqual(null);
    });
  });

  describe('.update() method tests', () => {
    beforeEach(async () => {
      await productsCollection.insertMany([PRODUCT_1, PRODUCT_2]);
      await feedbacksCollection.insertMany([
        FEEDBACK_1,
        FEEDBACK_2,
        FEEDBACK_3,
      ]);
    });

    it('Should update the product and return new version of product', async () => {
      const UPDATED_PRODUCT = { ...PRODUCT_1, title: 'Updated title' };

      const result = await productService.update(
        PRODUCT_1._id.toHexString(),
        UPDATED_PRODUCT,
      );

      const product = await productsCollection.findOne({ _id: PRODUCT_1._id });
      expect(product).toMatchObject(UPDATED_PRODUCT);
      expect(result).toMatchObject(UPDATED_PRODUCT);
    });

    it('Should return null when product doesnt exist', async () => {
      const UPDATED_PRODUCT = { ...PRODUCT_1, title: 'Updated title' };

      await productsCollection.findOneAndDelete({ _id: PRODUCT_1._id });

      const result = await productService.update(
        PRODUCT_1._id.toHexString(),
        UPDATED_PRODUCT,
      );

      expect(result).toEqual(null);
    });
  });
});
