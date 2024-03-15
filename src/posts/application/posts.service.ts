import { Injectable } from '@nestjs/common';
import { PostInputCreateModel, PostViewModel } from '../types/post.types';
import { Post, PostDocumentType } from '../domain/posts-schema';
import { PostsRepository } from '../repositories/posts.repository';
import { PostsQueryRepository } from '../repositories/posts.query-repository';
import { PostsMongoDataMapper } from '../domain/posts.mongo.dm';
import { WithId } from '../../blogs/types/blogs.types';
import { Types } from "mongoose";

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

  async createPost(
    body: PostInputCreateModel,
    blogName: string,
  ): Promise<WithId<PostViewModel> | false> {
    const PostEntity: Post = Post.creatPost(body, blogName);

    const createdPost = await this.postsRepository.createPost(PostEntity);
    return createdPost ? PostsMongoDataMapper.toView(createdPost) : false;
  }

  async getPostById(id: string): Promise<PostDocumentType | null> {
    return await this.postsQueryRepository.getPostById(id);
  }

  async updatePost(id: string, post: PostInputCreateModel): Promise<boolean> {
    return await this.postsRepository.updatePost(id, post);
  }
  async updatePostLikeStatus(id: Types.ObjectId, likeStatus: string,userId:string): Promise<boolean> {
    return await this.postsRepository.updatePostLikeStatus(id, likeStatus,userId)
  }
  async deleteAllData() {
    return await this.postsRepository.deleteAllData();
  }

  async deletePost(id: string): Promise<any> {
    return await this.postsRepository.deletePost(id);
  }
}
