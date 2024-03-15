import {forwardRef, Module} from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './repositories/blogs.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blogs-schema';
import { BlogsQueryRepository } from './repositories/blogs.query-repository';
import {PostsModule} from "../posts/posts.module";
import {CommonResponseFabric} from "../_common/common-response-fabric";
import { BasicStrategy } from "../auth/strategies/basic.strategy";
import { LocalStrategy } from "../auth/strategies/local.strategy";
import { BearerAuthGuard } from "../auth/guards/bearer-auth.guard";
import { BearerStrategy } from "../auth/strategies/bearer.strategy";
import { MyJwtService } from "../_common/jwt-service";
import { UsersQueryRepository } from "../users/repositories/users.query-repository";
import { JwtService } from "@nestjs/jwt";
import { User, UserSchema } from "../users/domain/users-schema";
import { PassportModule } from "@nestjs/passport";
const blogsProviders = [BlogsService, BlogsRepository, BlogsQueryRepository,]
@Module({
  imports: [
    PassportModule,
    forwardRef(() => PostsModule),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [BlogsController],
  providers: [...blogsProviders,
    CommonResponseFabric,CommonResponseFabric,
    BearerAuthGuard, BearerStrategy,
  MyJwtService, UsersQueryRepository, JwtService,
    ],
  exports:[
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository
  ]
})
export class BlogsModule {}
