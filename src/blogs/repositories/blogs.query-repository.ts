import { Blog, BlogDocumentType } from '../domain/blogs-schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { SortParamsModel } from '../../_common/query.utils';
import {BlogsQueryTransformTypes} from "../pipes/blogs-query-transform-pipe";

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async getBlogById(id: string): Promise<BlogDocumentType | null> {
    try {
      let a: any = await this.blogModel.findOne({ _id: new Types.ObjectId(id) }).lean();
      return a;
    } catch (r) {
      return null;
    }
  }

  async getBlogs(blogsQueries:BlogsQueryTransformTypes): Promise<{ totalCount: number; blogs: Blog[] }> {
    const query = this.blogModel.find(blogsQueries.findQuery);
    const totalCount = this.blogModel.find(blogsQueries.findQuery);

    const blogs = await query.sort(blogsQueries.sortParams).skip(blogsQueries.skip).limit(blogsQueries.limit).lean();
    if (blogs.length > 0) {
      const allBlogs = await totalCount.countDocuments();

      return { totalCount: allBlogs, blogs: blogs };
    } else return { totalCount: 0, blogs: [] };
  }
}
