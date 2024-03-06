import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Post, PostDocumentType } from '../domain/posts-schema';
import { BlogInputCreateModel } from '../../blogs/types/blogs.types';
import { PostInputCreateModel } from '../types/post.types';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async deleteAllData() {
    await this.postModel.deleteMany({});
    return true;
  }

  async createPost(postEntity?: Post): Promise<PostDocumentType | false> {
    const createdPost = new this.postModel(postEntity);
    const getCreatedPost = await createdPost.save();
    const postToReturn: PostDocumentType | null = await this.postModel.findOne({
      _id: getCreatedPost._id,
    });
    return postToReturn ? postToReturn : false;
  }

  async updatePost(id: string, postEntity: PostInputCreateModel): Promise<boolean> {
    const updatePost = await this.postModel.updateOne({ _id: new Types.ObjectId(id) }, postEntity);
    return updatePost.matchedCount === 1;
  }

  async deletePost(id: string): Promise<any> {
    const response = await this.postModel.deleteOne({ _id: new Types.ObjectId(id) });
    return response.deletedCount === 1 ? true : false;
  }
}
