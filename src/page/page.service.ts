import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePageDto } from './dto/create-page.dto';
import { Page, PageDocument, TopLevelCategory } from './schema/page.schema';

@Injectable()
export class PageService {
  constructor(
    @InjectModel(Page.name) private readonly pageModel: Model<PageDocument>,
  ) {}

  async create(pageDto: CreatePageDto): Promise<Page> {
    const page = new this.pageModel(pageDto);
    return page.save();
  }

  async getAll(): Promise<Page[]> {
    return this.pageModel.find();
  }

  async getById(id: string): Promise<Page | null> {
    return this.pageModel.findById(id);
  }

  async getByAlias(alias: string) {
    return this.pageModel.findOne({ alias });
  }

  async delete(id: string) {
    return this.pageModel.findByIdAndDelete(id);
  }

  async getByCategory(firstCategory: TopLevelCategory) {
    return this.pageModel.aggregate([
      { $match: { firstCategory } },
      {
        $group: {
          _id: { secondCategory: '$secondCategory' },
          pages: { $push: { alias: '$alias', title: '$title' } },
        },
      },
    ]);
  }
}
