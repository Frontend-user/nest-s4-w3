import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { ExtendedLikesInfoType, PostInputCreateModel } from '../types/post.types';

export type PostDocumentType = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop() title: string;

  @Prop() shortDescription: string;

  @Prop() content: string;

  @Prop() blogId: string;

  @Prop() blogName: string;

  @Prop() createdAt: Date;

  @Prop({ type: SchemaTypes.Mixed, required: true }) extendedLikesInfo: ExtendedLikesInfoType;

  static creatPost(body: PostInputCreateModel, blogName: string): Post {
    return {
      title: body.title,
      content: body.content,
      blogId: body.blogId,
      shortDescription: body.shortDescription,
      blogName: blogName,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
      createdAt: new Date(),
    };
  }
}

export type StaticCreatePostModel = (body: PostInputCreateModel, blogName: string) => Post;
export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.methods = {
  creatPost: Post.creatPost,
};
