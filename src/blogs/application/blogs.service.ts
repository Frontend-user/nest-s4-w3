import { BlogsRepository } from '../repositories/blogs.repository';
import { Injectable } from '@nestjs/common';
import { BlogInputCreateModel } from '../types/blogs.types';
import { Blog, BlogDocumentType } from '../domain/blogs-schema';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';

@Injectable()
export class BlogsService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async deleteAllData() {
    return await this.blogsRepository.deleteAllData();
  }

  async createBlog(body: BlogInputCreateModel): Promise<BlogDocumentType | false> {
    const blogEntity = Blog.createBlog(body);
    return await this.blogsRepository.createBlog(blogEntity);
  }

  async updateBlog(id: string, blog: BlogInputCreateModel): Promise<boolean> {
    return await this.blogsRepository.updateBlog(id, blog);
  }

  async getBlogById(id: string): Promise<BlogDocumentType | null> {
    return await this.blogsQueryRepository.getBlogById(id);
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteBlog(id);
  }
}
