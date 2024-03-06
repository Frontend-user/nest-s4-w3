import {forwardRef, Module} from '@nestjs/common';
import {PostsService} from './application/posts.service';
import {PostsRepository} from './repositories/posts.repository';
import {PostsController} from './posts.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {PostSchema, Post} from './domain/posts-schema';
import {PostsQueryRepository} from "./repositories/posts.query-repository";
import {BlogsModule} from "../blogs/blogs.module";
import {CommonResponseFabric} from "../_common/common-response-fabric";

@Module({
    imports: [
        forwardRef(() => BlogsModule),
        MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
    ],
    controllers: [PostsController],
    providers: [PostsService, PostsRepository,PostsQueryRepository,CommonResponseFabric],
    exports: [PostsRepository,
        PostsService,
        PostsQueryRepository]
})
export class PostsModule {
}
