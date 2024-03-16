import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Post, PostDocumentType } from "../domain/posts-schema";
import { PostsQueryTransformTypes } from "../pipes/posts-query-transform-pipe";
import { LIKE_STATUSES } from "../../_common/constants";
import { MyJwtService } from "../../_common/jwt-service";

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    protected myJwtService: MyJwtService,
  ) {}

  async getPostById(postId: string, accessToken?: any): Promise<PostDocumentType | null> {
    const post: PostDocumentType | null = await this.postModel.findOne({ _id: new Types.ObjectId(postId) }).lean();
    if (!post) {
      return null;
    }
    let accessUserId: string = "";
    if (accessToken) {
      accessUserId = await this.myJwtService.checkToken(accessToken.split(" ")[1]);
    }
    if (accessUserId) {
      const usersLikeStatuses: any[] | undefined = post!.extendedLikesInfo.usersLikeStatuses;
      if (usersLikeStatuses && usersLikeStatuses.length > 0) {
        const info = usersLikeStatuses.find((o) => String(o.userId) === accessUserId);
        if (info) {
          post!.extendedLikesInfo.myStatus = info.likeStatus;
        } else {
          post!.extendedLikesInfo.myStatus = LIKE_STATUSES.NONE;
        }
      }
    } else {
      post!.extendedLikesInfo.myStatus = LIKE_STATUSES.NONE;
    }
    const allLikeStatuses = post.extendedLikesInfo.usersLikeStatuses;
    const newestLikes = post.extendedLikesInfo.newestLikes;
    if (allLikeStatuses) {
      allLikeStatuses.forEach((item: any) => {
        if (item.likeStatus === LIKE_STATUSES.LIKE) {
          delete item.likeStatus;
          newestLikes.push(item);
        }
      });
    }

    post.extendedLikesInfo.newestLikes = newestLikes
      .sort((a: any, b: any) => {
        const addedAtA = a.addedAt.toUpperCase();
        const addedAtB = b.addedAt.toUpperCase();
        if (addedAtA < addedAtB) {
          return 1;
        }
        if (addedAtA > addedAtB) {
          return -1;
        }
        return 0;
      })
      .slice(0, 3);
    return post ? post : null;

    // try {
    //     const a: any = await this.postModel.findOne({_id: new Types.ObjectId(id)}).lean();
    //     return a;
    // } catch (e) {
    //     return null;
    // }
  }

  async getPosts(postsQuery: PostsQueryTransformTypes): Promise<any> {
    const query = this.postModel.find();
    const totalCount = this.postModel.find();

    const posts = await query.sort(postsQuery.sortParams).skip(postsQuery.skip).limit(postsQuery.limit).lean();
    if (posts.length > 0) {
      const allPosts = await totalCount.countDocuments();

      return { totalCount: allPosts, posts: posts };
    } else return [];
  }

  async getPostsByBlogId(postsQueries: PostsQueryTransformTypes, id: string | Types.ObjectId): Promise<any> {
    try {
      await this.postModel.find({ blogId: id }).lean();
    } catch (e) {
      return false;
    }

    const query = this.postModel.find({ blogId: id });
    const totalCount = this.postModel.find({ blogId: id });

    const posts = await query.sort(postsQueries.sortParams).skip(postsQueries.skip).limit(postsQueries.limit).lean();
    if (posts.length > 0) {
      const allPosts = await totalCount.countDocuments();

      return { totalCount: allPosts, posts: posts };
    } else return [];
  }
}
