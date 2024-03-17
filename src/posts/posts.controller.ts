import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { PostsService } from "./application/posts.service";
import { PostsQueryRepository } from "./repositories/posts.query-repository";
import { PostDocumentType } from "./domain/posts-schema";
import { LikeStatus, LikeStatusClass, PostInputCreateModel, PostViewModel } from "./types/post.types";
import { PostsMongoDataMapper } from "./domain/posts.mongo.dm";
import { BlogsQueryRepository } from "../blogs/repositories/blogs.query-repository";
import { PostsQueryTransformPipe, PostsQueryTransformTypes } from "./pipes/posts-query-transform-pipe";
import { CommonResponseFabric } from "../_common/common-response-fabric";
import { BasicAuthGuard } from "../auth/guards/basic-auth.guart";
import { Types } from "mongoose";
import { BearerAuthGuard } from "../auth/guards/bearer-auth.guard";
import { Request } from "express";
import { LIKE_STATUSES } from "../_common/constants";
import { validate } from "class-validator";

@Controller("/posts")
export class PostsController {
  constructor(
    protected commonResponseFabric: CommonResponseFabric,
    protected postsService: PostsService,
    protected postsQueryRepository: PostsQueryRepository,
    @Inject(forwardRef(() => BlogsQueryRepository))
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  async getPosts(@Query(PostsQueryTransformPipe) postsQueries: PostsQueryTransformTypes, @Req() req: Request) {
    const result = await this.postsQueryRepository.getPosts(postsQueries, req.headers.authorization);

    if (!result) {
      throw new HttpException("Falied getPosts", HttpStatus.NOT_FOUND);
    }
    const { totalCount, posts } = result;
    return this.commonResponseFabric.createAndGetResponse(postsQueries, posts, totalCount, PostsMongoDataMapper);
  }

  @Get("/:id")
  async getPostById(@Param() id: string, @Req() req: Request): Promise<PostViewModel | any> {
    try {
      const post: PostDocumentType | null = await this.postsQueryRepository.getPostById(id, req.headers.authorization);
      if (post) {
        return PostsMongoDataMapper.toView(post);
      }
      throw new HttpException("Falied getPostById", HttpStatus.NOT_FOUND);
    } catch (e) {
      console.log(e);
      throw new HttpException("Falied getPostById", HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  @Post()
  async createPost(@Body() body: any) {
    await this.postsService.createPost(body);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put("/:id")
  async updatePost(@Body() body: PostInputCreateModel, @Param("id") id: string) {
    try {
      const response: boolean = await this.postsService.updatePost(id, body);
      if (!response) {
        throw new HttpException("Falied updatePost", HttpStatus.NOT_FOUND);
      }
    } catch (e) {
      console.log(e);
      throw new HttpException("Falied updatePost", HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(BearerAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put("/:postId/like-status")
  async updatePostLikeStatus(@Body() body: LikeStatusClass, @Param("postId") postId: string, @Req() req: any) {
    const userId = req.headers.userId;
    const { likeStatus } = body;

    const response1: any = await this.postsService.updatePostLikeStatus(postId, likeStatus, userId);
    console.log(response1, "r1");
    if (!response1) {
      throw new HttpException("Falied update Post LikeStatus", HttpStatus.NOT_FOUND);
    }
    const response: any = await this.postsQueryRepository.getPostById(postId);
    if (!response) {
      // return 'aaaa'
      throw new HttpException("Falied update Post LikeStatus", HttpStatus.NOT_FOUND);
    }
  }

  // // @UseGuards(BearerAuthGuard)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @Put("/:postId/like-status")
  // async updatePostLikeStatus(@Body() likeStatus: LikeStatus, @Param("postId") postId: string, @Req() headers: any) {
  //   return {'a':'b'}
  //   try {
  //     const response1: any = await this.postsService.updatePostLikeStatus(new Types.ObjectId(postId), likeStatus);
  //     console.log(response1,'r1');
  //     const response:any = await this.postsQueryRepository.getPostById(postId, headers!.authorization);
  //     // res.send(post)
  //     if (!response) {
  //       throw new HttpException("Falied update Post LikeStatus", HttpStatus.NOT_FOUND);
  //     }
  //   } catch (error) {
  //     throw new HttpException("Falied update Post LikeStatus", HttpStatus.NOT_FOUND);
  //
  //   }
  // }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("/:id")
  async deletePost(@Param("id") id: string) {
    try {
      const response: any = await this.postsService.deletePost(id);
      if (!response) {
        throw new HttpException("Falied deletePost", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException("Falied deletePost", HttpStatus.NOT_FOUND);
    }
  }
}
