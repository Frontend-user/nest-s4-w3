import {ConfigModule} from '@nestjs/config';

import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {Blog, BlogSchema} from './blogs/domain/blogs-schema';
import {PostSchema, Post} from './posts/domain/posts-schema';
import {User, UserSchema} from './users/domain/users-schema';
import {AuthModule} from "./auth/auth.module";
import {BlogsModule} from "./blogs/blogs.module";
import {PostsModule} from "./posts/posts.module";
import {UsersModule} from "./users/users.module";
import {ServeStaticModule} from "@nestjs/serve-static";
import { join } from 'path';
import { BearerAuthGuard } from "./auth/guards/bearer-auth.guard";
import { BearerStrategy } from "./auth/strategies/bearer.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        ConfigModule.forRoot(),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'swagger-static'),
            serveRoot: process.env.NODE_ENV === "development" ? '/' : '/swagger',
        }),
        PassportModule,
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
        MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}]),
        MongooseModule.forRoot(process.env.MONGO_NEST_URL as string),
        AuthModule,
        UsersModule,
        BlogsModule,
        PostsModule
    ],

    controllers: [AppController],


    providers: [AppService,BearerAuthGuard, BearerStrategy],
})
export class AppModule {
}
