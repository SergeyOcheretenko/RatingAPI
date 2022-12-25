import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { CreateProductDto } from '../../../src/product/dto/create-product.dto';
import { FindByCategoryDto } from '../../../src/product/dto/find-products.dto';
import { PRODUCT_NOT_FOUND_ERROR } from '../../../src/product/product.constants';
import { ProductController } from '../../../src/product/product.controller';
import { ProductService } from '../../../src/product/product.service';
import { MockProductService } from '../../mocks/product/product.service.mock';

describe('ProductController (unit)', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeAll(() => {
    productService = new MockProductService() as unknown as ProductService;
    productController = new ProductController(productService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const CREATE_PRODUCT_DTO: CreateProductDto = {
    image: 'url',
    title: 'ball',
    price: 220,
    credit: 34,
    description: 'description',
    advantages: 'nice',
    disAdvantages: 'not nice',
    categories: ['sport'],
    tags: ['sport'],
    characteristics: [
      {
        name: 'size',
        value: '22.5',
      },
    ],
  };

  describe('.create() method tests', () => {
    const CREATED_PRODUCT = 'Create product response';

    beforeEach(() => {
      productService.create = jest.fn().mockResolvedValue(CREATED_PRODUCT);
    });

    it('Should call productService.call() method', async () => {
      const result = await productController.create(CREATE_PRODUCT_DTO);

      expect(productService.create).toHaveBeenCalledWith(CREATE_PRODUCT_DTO);
      expect(result).toEqual(CREATED_PRODUCT);
    });
  });

  describe('.getAll() method tests', () => {
    const RESPONSE = 'Get all response';

    beforeEach(() => {
      productService.getAll = jest.fn().mockResolvedValue(RESPONSE);
    });

    it('Should call productService.getAll() method', async () => {
      const result = await productController.getAll();

      expect(productService.getAll).toHaveBeenCalled();
      expect(result).toEqual(RESPONSE);
    });
  });

  describe('.getById() method tests', () => {
    const ID = '1a2b3c4d';

    const RESPONSE = 'Get by id response';

    beforeEach(() => {
      productService.getById = jest.fn().mockResolvedValue(RESPONSE);
    });

    it('Should call productService.getById() method and return product', async () => {
      const result = await productController.getById(ID);

      expect(productService.getById).toHaveBeenCalledWith(ID);
      expect(result).toEqual(RESPONSE);
    });

    it('Should throw the HttpException NOT_FOUND when product not found', async () => {
      productService.getById = jest.fn().mockResolvedValue(null);

      await expect(() => productController.getById(ID)).rejects.toThrowError(
        new HttpException(PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND),
      );

      expect(productService.getById).toHaveBeenCalledWith(ID);
    });
  });

  describe('.delete() method tests', () => {
    const ID = '1a2b3c4d';

    const RESPONSE = 'Delete response';

    beforeEach(() => {
      productService.delete = jest.fn().mockResolvedValue(RESPONSE);
    });

    it('Should call productService.delete() method and return deleted product', async () => {
      const result = await productController.delete(ID);

      expect(productService.delete).toHaveBeenCalledWith(ID);
      expect(result).toEqual(RESPONSE);
    });

    it('Should throw the HttpException NOT_FOUND when product not found', async () => {
      productService.delete = jest.fn().mockResolvedValue(null);

      await expect(() => productController.delete(ID)).rejects.toThrowError(
        new HttpException(PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND),
      );

      expect(productService.delete).toHaveBeenCalledWith(ID);
    });
  });

  describe('.update() method tests', () => {
    const ID = '1a2b3c4d';

    const RESPONSE = 'Update response';

    beforeEach(() => {
      productService.update = jest.fn().mockResolvedValue(RESPONSE);
    });

    it('Should call productService.update() method and return updated product', async () => {
      const result = await productController.update(ID, CREATE_PRODUCT_DTO);

      expect(productService.update).toHaveBeenCalledWith(
        ID,
        CREATE_PRODUCT_DTO,
      );
      expect(result).toEqual(RESPONSE);
    });

    it('Should throw the HttpException NOT_FOUND when product not found', async () => {
      productService.update = jest.fn().mockResolvedValue(null);

      await expect(() =>
        productController.update(ID, CREATE_PRODUCT_DTO),
      ).rejects.toThrowError(
        new HttpException(PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND),
      );

      expect(productService.update).toHaveBeenCalledWith(
        ID,
        CREATE_PRODUCT_DTO,
      );
    });
  });

  describe('.findByCategory() method tests', () => {
    const FIND_PRODUCT_DTO: FindByCategoryDto = {
      category: 'sport',
      limit: 10,
    };

    const RESPONSE = 'Find by category response';

    beforeEach(() => {
      productService.findByCategory = jest.fn().mockResolvedValue(RESPONSE);
    });

    it('Should call productService.findByCategory() method and return updated product', async () => {
      const result = await productController.findByCategory(FIND_PRODUCT_DTO);

      expect(productService.findByCategory).toHaveBeenCalledWith(
        FIND_PRODUCT_DTO,
      );
      expect(result).toEqual(RESPONSE);
    });
  });
});
