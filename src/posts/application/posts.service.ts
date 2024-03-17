import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { LikeStatus, PostInputCreateModel, PostViewModel } from "../types/post.types";
import { Post  } from "../domain/posts-schema";
import { PostsRepository } from "../repositories/posts.repository";
import { PostsQueryRepository } from "../repositories/posts.query-repository";
import { PostsMongoDataMapper } from "../domain/posts.mongo.dm";
import { WithId } from "../../blogs/types/blogs.types";
import { UsersQueryRepository } from "../../users/repositories/users.query-repository";
import { LIKE_STATUSES } from "../../_common/constants";
import { BlogsQueryRepository } from "../../blogs/repositories/blogs.query-repository";
import { validate, ValidationError } from "class-validator";

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected usersQueryRepository: UsersQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async createPost(body: any): Promise<WithId<PostViewModel> | false> {
    const errorsMessages: any[] = [];
    const blogExistErrors: any = [];
    try {
      const blog = await this.blogsQueryRepository.getBlogById(body.blogId);
      if (!blog) {
        throw new HttpException({ message: "Blogid is not exist", field: "blogId" }, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      errorsMessages.push({ message: "Blogid is not exist", field: "blogId" });
    }

    // Опции для валидации
    const options = {
      transform: true,

      skipMissingProperties: true, // Пропустить отсутствующие свойства
    };

    const bodyInstance = Object.assign(new PostInputCreateModel(), body);
    // Выполнить валидацию
    const errors: ValidationError[] = await validate(bodyInstance, options);
    const allErrors = [...blogExistErrors, ...errors];

    errors.forEach((e) => {
      if (e.constraints) {
        const s: any = Object.keys(e.constraints);
        s.forEach((key) => {
          if (e.constraints) {
            errorsMessages.push({
              field: e.property,
              message: e.constraints[key],
            });
          }
        });
      }
    });
    errorsMessages.push()

    if (errors.length > 0) {
      throw new BadRequestException({errorsMessages})
    }

    const PostEntity: Post = Post.creatPost(body, "blog.name");

    const createdPost = await this.postsRepository.createPost(PostEntity);
    return createdPost ? PostsMongoDataMapper.toView(createdPost) : false;
  }

  async updatePost(id: string, post: any): Promise<boolean> {
   const errorsMessages: any[] = [];
    const blogExistErrors: any = [];
    try {
      const post = await this.postsQueryRepository.getPostById(id);
      if (!post) {
        throw new HttpException({ message: "postId is not exist", field: "postId" }, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      errorsMessages.push({ message: "postId is not exist", field: "postId" });
    }
    const options = {
      skipMissingProperties: true, // Пропустить отсутствующие свойства
    };

    const bodyInstance = Object.assign(new PostInputCreateModel(), post);
    // Выполнить валидацию
    const errors: ValidationError[] = await validate(bodyInstance, options);
    const allErrors = [...blogExistErrors, ...errors];

    errors.forEach((e) => {
      if (e.constraints) {
        const s: any = Object.keys(e.constraints);
        s.forEach((key) => {
          if (e.constraints) {
            errorsMessages.push({
              field: e.property,
              message: e.constraints[key],
            });
          }
        });
      }
    });
    errorsMessages.push()

    if (errors.length > 0) {
      throw new BadRequestException({errorsMessages})
    }

    return await this.postsRepository.updatePost(id, post);
  }

  async updatePostLikeStatus(postId: string, likeStatus: LikeStatus, userId: string): Promise<boolean> {
    if (![LIKE_STATUSES.LIKE, LIKE_STATUSES.DISLIKE, LIKE_STATUSES.NONE].includes(likeStatus)) {
      throw new HttpException({ message: "likeStatus is wrong", field: "likeStatus" }, HttpStatus.BAD_REQUEST);
    }
    return await this.postsRepository.updatePostLikeStatus(postId, likeStatus, userId);
  }

  async deleteAllData() {
    return await this.postsRepository.deleteAllData();
  }

  async deletePost(id: string): Promise<any> {
    return await this.postsRepository.deletePost(id);
  }
}
