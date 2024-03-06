import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BlogInputCreateModel } from '../types/blogs.types';

export type BlogDocumentType = HydratedDocument<Blog>;

export type BlogAccountDBMethodsType = {
  canBeConfirmed: () => boolean;
};

// export type BlogModelType = Model<Blog, {}, BlogAccountDBMethodsType>;

@Schema()
export class Blog {
  @Prop() name: string;

  @Prop() description: string;

  @Prop() websiteUrl: string;

  @Prop() createdAt: Date;

  @Prop() isMembership: boolean;

  static createBlog(body: BlogInputCreateModel) {
    return {
      ...body,
      isMembership: false,
      createdAt: new Date(),
    };
  }
}

export type StaticCreateBlogType = (body: BlogInputCreateModel) => Blog;
export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.statics = {
  changeToViewFormat: Blog.createBlog,
};
