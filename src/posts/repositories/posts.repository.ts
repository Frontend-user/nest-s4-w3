import { Model, ObjectId, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Post, PostDocumentType } from "../domain/posts-schema";
import { BlogInputCreateModel } from "../../blogs/types/blogs.types";
import { newestLikes, PostInputCreateModel, usersIdsLikeStatuses, usersIdsPostsLikeStatuses } from "../types/post.types";
import { LIKE_STATUSES } from "../../_common/constants";
import { UsersQueryRepository } from "../../users/repositories/users.query-repository";

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  async deleteAllData() {
    await this.postModel.deleteMany({});
    return true;
  }

  async createPost(postEntity?: Post): Promise<PostDocumentType | false> {
    const createdPost = new this.postModel(postEntity);
    const getCreatedPost = await createdPost.save();
    const postToReturn: PostDocumentType | null = await this.postModel.findOne({
      _id: getCreatedPost._id,
    });
    return postToReturn ? postToReturn : false;
  }

  async updatePost(id: string, postEntity: PostInputCreateModel): Promise<boolean> {
    const updatePost = await this.postModel.updateOne({ _id: new Types.ObjectId(id) }, postEntity);
    return updatePost.matchedCount === 1;
  }

  async updatePostLikeStatus(id: Types.ObjectId, likeStatus:any, userId: string): Promise<boolean> {
      likeStatus = likeStatus.likeStatus
    console.log(likeStatus,'likeStatus');
    const user: any = await this.usersQueryRepository.getUserById(userId);
    if (!user) return false;
    const currentUser = {
      id: String(user._id),
      login: user.accountData.login,
    };

    const userIdLikeStatus: usersIdsPostsLikeStatuses = {
      userId: currentUser.id,
      likeStatus: likeStatus,
      addedAt: new Date().toISOString(),
      login: currentUser.login,
    };
    const newestLike: newestLikes = {
      addedAt: new Date().toISOString(),
      userId: currentUser.id,
      login: currentUser.login,
    };

    const posts: any = await this.postModel.find({});
    console.log(posts);
    const post: any = await this.postModel.findOne({ _id: id });
    //

    // post.extendedLikesInfo.myStatus = likeStatus;
    // post.markModified("extendedLikesInfo");
    // await post.save();
    // await this.postModel.findByIdAndUpdate(id, post)
    //
    // return true;
    // console.log(post);

    const postForLikeArray: any = await this.postModel.findOne({ _id: id }).lean();
    const postLikeStatusesArray: usersIdsLikeStatuses[] = postForLikeArray.extendedLikesInfo.usersLikeStatuses;
    console.log(postLikeStatusesArray);
    const findObject = postLikeStatusesArray.find((o) => o.userId === currentUser.id);

    if (!findObject && likeStatus !== LIKE_STATUSES.NONE) {
      if (likeStatus === LIKE_STATUSES.LIKE) {
        let currentLikes = post.extendedLikesInfo.likesCount;
        currentLikes++;
        post.extendedLikesInfo.likesCount = currentLikes;
      } else {
        let currentDislikes = post.extendedLikesInfo.dislikesCount;
        currentDislikes++;
        post.extendedLikesInfo.dislikesCount = currentDislikes;
      }

      post.extendedLikesInfo.myStatus = likeStatus;
      post.extendedLikesInfo.usersLikeStatuses.push(userIdLikeStatus);
      post.markModified('extendedLikesInfo')
      await post.save()
      // await this.postModel.findByIdAndUpdate(id, post);
    }

    if (likeStatus !== LIKE_STATUSES.NONE && findObject && findObject.likeStatus !== likeStatus) {
      const getPost: any = await this.postModel.findOne({ _id: id });
      let dislikes: number = getPost.extendedLikesInfo.dislikesCount;
      let likes: number = getPost.extendedLikesInfo.likesCount;
      if (likeStatus === LIKE_STATUSES.DISLIKE) {
        dislikes++;
        likes--;
      } else {
        likes++;
        dislikes--;
      }

      await this.postModel.updateOne(
        { _id: id, "extendedLikesInfo.usersLikeStatuses.userId": currentUser.id },
        {
          $set: {
            "extendedLikesInfo.myStatus": likeStatus,
            "extendedLikesInfo.likesCount": likes,
            "extendedLikesInfo.dislikesCount": dislikes,
            "extendedLikesInfo.usersLikeStatuses.$.likeStatus": likeStatus,
          },
        },
      );
      const updatedPost: any = await this.postModel.findOne({ _id: id });
    }

    if (likeStatus === LIKE_STATUSES.NONE && findObject && likeStatus !== post.extendedLikesInfo.myStatus) {
      const getPost: any = await this.postModel.findOne({ _id: id });
      let dislikes: number = getPost.extendedLikesInfo.dislikesCount;
      let likes: number = getPost.extendedLikesInfo.likesCount;
      const pastLikeStatus = getPost.extendedLikesInfo.myStatus;
      if (pastLikeStatus === LIKE_STATUSES.DISLIKE) {
        dislikes--;
      } else {
        likes--;
      }
      await this.postModel.updateOne(
        { _id: id },
        {
          $set: {
            "extendedLikesInfo.myStatus": LIKE_STATUSES.NONE,
            "extendedLikesInfo.likesCount": likes,
            "extendedLikesInfo.dislikesCount": dislikes,
          },
          $pull: { "extendedLikesInfo.usersLikeStatuses": { userId: currentUser.id } },
        },
      );
    }

    return true;
  }

  async deletePost(id: string): Promise<any> {
    const response = await this.postModel.deleteOne({ _id: new Types.ObjectId(id) });
    return response.deletedCount === 1 ? true : false;
  }
}
