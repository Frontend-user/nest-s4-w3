import { BlogViewModel, WithId } from '../types/blogs.types';
import { BlogDocumentType } from './blogs-schema';

export class BlogsMongoDataMapper {
  static toView(blog: BlogDocumentType): WithId<BlogViewModel> {
    return {
      id: String(blog._id),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: blog.isMembership,
      createdAt: blog.createdAt,
    };
  }
}
