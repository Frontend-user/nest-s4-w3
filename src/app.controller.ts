import {Controller, Delete, Get, Res} from '@nestjs/common';
import {AppService} from './app.service';
import {BlogsService} from './blogs/application/blogs.service';
import {PostsService} from './posts/application/posts.service';
import {UsersService} from "./users/application/users.service";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        protected blogsService: BlogsService,
        protected postsService: PostsService,
        protected usersService: UsersService,
    ) {
    }

    @Delete('/testing/all-data')
    async deleteAllData(@Res() res) {
        await this.blogsService.deleteAllData();
        await this.postsService.deleteAllData();
        await this.usersService.deleteAllData();
        res.status(204).send();
    }

    @Get()
    hi() {
        return 'Hello WORLD!'
    }

}
