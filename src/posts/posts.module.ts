import { forwardRef, Module } from "@nestjs/common";
import { PostsService } from "./application/posts.service";
import { PostsRepository } from "./repositories/posts.repository";
import { PostsController } from "./posts.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { PostSchema, Post } from "./domain/posts-schema";
import { PostsQueryRepository } from "./repositories/posts.query-repository";
import { BlogsModule } from "../blogs/blogs.module";
import { CommonResponseFabric } from "../_common/common-response-fabric";
import { PassportModule } from "@nestjs/passport";
import { BearerStrategy } from "../auth/strategies/bearer.strategy";
import { BearerAuthGuard } from "../auth/guards/bearer-auth.guard";
import { MyJwtService } from "../_common/jwt-service";
import { UsersQueryRepository } from "../users/repositories/users.query-repository";
import { JwtService } from "@nestjs/jwt";
import { User, UserSchema } from "../users/domain/users-schema";

@Module({
  imports: [
    PassportModule,
    forwardRef(() => BlogsModule),
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    BearerAuthGuard,
    BearerStrategy,
    PostsRepository,
    PostsQueryRepository,
    CommonResponseFabric,
    MyJwtService,
    UsersQueryRepository,
    JwtService,
  ],
  exports: [PostsRepository, PostsService, PostsQueryRepository],
})
export class PostsModule {}
