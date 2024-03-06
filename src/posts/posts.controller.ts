import {
    Body,
    Controller,
    Delete, forwardRef,
    Get,
    HttpCode,
    HttpException,
    HttpStatus, Inject,
    Param,
    Post,
    Put,
    Query,
    Res
} from '@nestjs/common';
import {PostsService} from './application/posts.service';
import {PostsRepository} from './repositories/posts.repository';
import {PostsQueryRepository} from './repositories/posts.query-repository';
import {PostDocumentType} from './domain/posts-schema';
import {PostInputCreateModel, PostViewModel} from './types/post.types';
import {PostsMongoDataMapper} from './domain/posts.mongo.dm';
import {BlogsQueryRepository} from '../blogs/repositories/blogs.query-repository';
import {HTTP_STATUSES} from '../_common/constants';
import {QueryUtilsClass} from '../_common/query.utils';
import {BlogsQueryTransformPipe, BlogsQueryTransformTypes} from "../blogs/pipes/blogs-query-transform-pipe";
import {PostsQueryTransformPipe, PostsQueryTransformTypes} from "./pipes/posts-query-transform-pipe";
import {CommonResponseFabric} from "../_common/common-response-fabric";
import {UsersMongoDataMapper} from "../users/domain/users.mongo.dm";

@Controller('/posts')
export class PostsController {
    constructor(
        protected commonResponseFabric: CommonResponseFabric,
        protected postsService: PostsService,
        protected postsQueryRepository: PostsQueryRepository,
        @Inject(forwardRef(() => BlogsQueryRepository))
        protected blogsQueryRepository: BlogsQueryRepository,
    ) {
    }

    @Get()
    async getPosts(
        @Query(PostsQueryTransformPipe) postsQueries: PostsQueryTransformTypes)
    {
        const result = await this.postsQueryRepository.getPosts(postsQueries);

        if (!result) {
            throw new HttpException('Falied getPosts', HttpStatus.NOT_FOUND)
        }
        const {totalCount, posts} = result;
        return this.commonResponseFabric.createAndGetResponse(postsQueries, posts, totalCount,PostsMongoDataMapper)
    }

    @Get('/:id')
    async getPostById(@Param() id: string): Promise<PostViewModel | any> {
        try {
            const post: PostDocumentType | null = await this.postsQueryRepository.getPostById(id);
            if (post) {
                return PostsMongoDataMapper.toView(post);
            }
            throw new HttpException('Falied getPostById', HttpStatus.NOT_FOUND)
        } catch (e) {
            console.log(e);
            throw new HttpException('Falied getPostById', HttpStatus.NOT_FOUND)

        }
    }

    @HttpCode(201)
    @Post()
    async createPost(@Body() body: PostInputCreateModel) {
        const getBlog: any = await this.blogsQueryRepository.getBlogById(body.blogId);
        if (getBlog) {
            try {
                const postId = await this.postsService.createPost(body, getBlog.name);
                if (postId) {
                    return postId
                }
                throw new HttpException('Falied createPost', HttpStatus.BAD_REQUEST)
            } catch (error) {
                throw new HttpException('Falied createPost', HttpStatus.BAD_REQUEST)
            }
        }
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Put('/:id')
    async updatePost(@Body() body: PostInputCreateModel, @Param('id') id: string) {
        try {
            const response: boolean = await this.postsService.updatePost(id, body);
            if (!response) {
                throw new HttpException('Falied updatePost', HttpStatus.NOT_FOUND)
            }
        } catch (e) {
            console.log(e);
            throw new HttpException('Falied updatePost', HttpStatus.NOT_FOUND)
        }
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    async deletePost(@Param('id') id: string) {
        try {
            const response: any = await this.postsService.deletePost(id);
            if (!response) {
                throw new HttpException('Falied deletePost', HttpStatus.NOT_FOUND)
            }
        } catch (error) {
            throw new HttpException('Falied deletePost', HttpStatus.NOT_FOUND)
        }
    }
}
