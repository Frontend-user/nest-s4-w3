import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Injectable} from '@nestjs/common';
import {Types} from 'mongoose';
import {Post, PostDocumentType} from '../domain/posts-schema';
import {PostsQueryTransformTypes} from "../pipes/posts-query-transform-pipe";

@Injectable()
export class PostsQueryRepository {
    constructor(@InjectModel(Post.name) private postModel: Model<Post>) {
    }

    async getPostById(id: string): Promise<PostDocumentType | null> {
        try {
            let a: any = await this.postModel.findOne({_id: new Types.ObjectId(id)}).lean();
            return a;
        } catch (e) {
            return null;
        }
    }

    async getPosts(postsQuery: PostsQueryTransformTypes): Promise<any> {
        const query = this.postModel.find();
        const totalCount = this.postModel.find();

        const posts = await query.sort(postsQuery.sortParams).skip(postsQuery.skip).limit(postsQuery.limit).lean();
        if (posts.length > 0) {
            const allPosts = await totalCount.countDocuments();

            return {totalCount: allPosts, posts: posts};
        } else return [];
    }

    async getPostsByBlogId(postsQueries:PostsQueryTransformTypes, id): Promise<any> {
        try {
            await this.postModel.find({blogId: id}).lean();
        } catch (e) {
            return false;
        }

        const query = this.postModel.find({blogId: id});
        const totalCount = this.postModel.find({blogId: id});

        const posts = await query.sort(postsQueries.sortParams).skip(postsQueries.skip).limit(postsQueries.limit).lean();
        if (posts.length > 0) {
            const allPosts = await totalCount.countDocuments();

            return {totalCount: allPosts, posts: posts};
        } else return [];
    }
}
