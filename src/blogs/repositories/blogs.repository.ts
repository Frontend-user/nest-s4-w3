import { Blog, BlogDocumentType } from '../domain/blogs-schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { BlogInputCreateModel } from '../types/blogs.types';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async deleteAllData() {
    await this.blogModel.deleteMany({});
    return true;
  }

  async createBlog(blogEntity?: Blog): Promise<BlogDocumentType | false> {
    const createdBlog = new this.blogModel(blogEntity);
    const getCreatedBlog = await createdBlog.save();
    const blogToReturn: BlogDocumentType | null = await this.blogModel.findOne({
      _id: getCreatedBlog._id,
    });
    return blogToReturn ? blogToReturn : false;
  }

  async updateBlog(id: string, blogEntity: BlogInputCreateModel): Promise<boolean> {
    const updateBlog = await this.blogModel.updateOne({ _id: new Types.ObjectId(id) }, blogEntity);
    return updateBlog.matchedCount === 1;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const response = await this.blogModel.deleteOne({ _id: new Types.ObjectId(id) });
    return !!response.deletedCount;
  }
}
