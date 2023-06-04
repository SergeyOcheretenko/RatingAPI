import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { Page, PageSchema } from '../../schemas/page.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
  ],
  controllers: [PageController],
  providers: [PageService],
})
export class PageModule {}
