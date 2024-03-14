import {
    Body,
    Controller,
    Delete, forwardRef,
    Get,
    HttpCode,
    HttpException, HttpStatus, Inject,
    Param,
    Post,
    Put,
    Query, UseGuards,
} from "@nestjs/common";
import {BlogsService} from './application/blogs.service';
import {BlogInputCreateModel, BlogViewModel, WithId} from './types/blogs.types';
import {BlogsMongoDataMapper} from './domain/blogs.mongo.dm';
import {BlogDocumentType} from './domain/blogs-schema';
import {PostInputCreateModel, PostViewModel} from '../posts/types/post.types';
import {PostsService} from '../posts/application/posts.service';
import {BlogsQueryRepository} from './repositories/blogs.query-repository';
import {PostsQueryRepository} from '../posts/repositories/posts.query-repository';
import {PostsMongoDataMapper} from '../posts/domain/posts.mongo.dm';
import {BlogsQueryTransformPipe, BlogsQueryTransformTypes} from "./pipes/blogs-query-transform-pipe";
import {PostsQueryTransformPipe, PostsQueryTransformTypes} from "../posts/pipes/posts-query-transform-pipe";
import {CommonResponseFabric} from "../_common/common-response-fabric";
import { LocalAuthGuard } from "../auth/guards/local-auth.guard";

@Controller('/blogs')
export class BlogsController {
    constructor(
        protected commonResponseFabric: CommonResponseFabric,
        protected blogsService: BlogsService,
                @Inject(forwardRef(() => PostsService))
                protected postsService: PostsService,
                protected blogsQueryRepository: BlogsQueryRepository,
                @Inject(forwardRef(() => PostsQueryRepository))
                protected postsQueryRepository: PostsQueryRepository,
    ) {
    }

    @Get()
    async getBlogs(
        @Query(BlogsQueryTransformPipe) blogsQueries: BlogsQueryTransformTypes) {
        const {totalCount, blogs} = await this.blogsQueryRepository.getBlogs(blogsQueries);
        return this.commonResponseFabric.createAndGetResponse(blogsQueries, blogs, totalCount, BlogsMongoDataMapper)
    }

    @Get('/:id')
    async getBlogById(@Param('id') id: string): Promise<BlogViewModel | any> {
        const blog: BlogDocumentType | null = await this.blogsQueryRepository.getBlogById(id);
        if (!blog) {
            throw new HttpException('Failed getBlogById', HttpStatus.NOT_FOUND)
        }
        return BlogsMongoDataMapper.toView(blog)
    }

    @Get('/:id/posts')
    async getPostByBlogId(
        @Param('id') id: string,
        @Query(PostsQueryTransformPipe) postsQueries: PostsQueryTransformTypes) {
        if (!id) {
            throw new HttpException('Failed getPostByBlogId', HttpStatus.NOT_FOUND)
        }
        const result = await this.postsQueryRepository.getPostsByBlogId(postsQueries, id);

        const blog = await this.blogsQueryRepository.getBlogById(id);
        if (!blog) {
            throw new HttpException('Failed getPostByBlogId', HttpStatus.NOT_FOUND)
        }
        const {totalCount, posts} = result;
        return this.commonResponseFabric.createAndGetResponse(postsQueries, posts, totalCount, PostsMongoDataMapper)
    }

    @UseGuards(LocalAuthGuard)
    @HttpCode(201)
    @Post()
    async createBlog(@Body() body: BlogInputCreateModel): Promise<WithId<BlogViewModel>> {
        const blog: BlogDocumentType | false = await this.blogsService.createBlog(body);
        if (!blog) {
            throw new HttpException('Failed createBlog', HttpStatus.NOT_FOUND)
        }
        return BlogsMongoDataMapper.toView(blog)
    }

    @UseGuards(LocalAuthGuard)
    @HttpCode(201)
    @Post('/:id/posts')
    async createPostByBlogId(
        @Body() body: PostInputCreateModel,
        @Param('id') id: string
    ): Promise<WithId<PostViewModel> | undefined> {
        const blog = await this.blogsQueryRepository.getBlogById(id);
        if (blog) {
            body.blogId = String(blog._id);
            const post: WithId<PostViewModel> | false = await this.postsService.createPost(
                body,
                blog.name,
            );
            if (!post) {
                throw new HttpException('Failed createPostByBlogId', HttpStatus.NOT_FOUND)

            }
            return post
        }
        throw new HttpException('Failed createPostByBlogId', HttpStatus.NOT_FOUND)

    }

    @UseGuards(LocalAuthGuard)
    @HttpCode(204)
    @Put('/:id')
    async updateBlog(@Body() body: BlogInputCreateModel, @Param('id') id: string) {
        const response: boolean = await this.blogsService.updateBlog(id, body);
        if (!response) {
            throw new HttpException('Failed updateBlog', HttpStatus.NOT_FOUND)
        }
    }

    @UseGuards(LocalAuthGuard)
    @Delete('/:id')
    @HttpCode(204)
    async deleteBlog(@Param('id') id: string) {
        try {
            const response: boolean = await this.blogsService.deleteBlog(id);
            if (!response) {
                throw new HttpException('Failed updateBlog', HttpStatus.NOT_FOUND)
            }
        } catch (error) {
            throw new HttpException('Failed updateBlog', HttpStatus.NOT_FOUND)
        }
    }
}
