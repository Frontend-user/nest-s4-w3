import { PostDocumentType } from './posts-schema';
import { PostViewModel, WithId } from '../types/post.types';

export class PostsMongoDataMapper {
  static toView(post: PostDocumentType): WithId<PostViewModel> {
    return {
      id: String(post._id),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      extendedLikesInfo: {
        dislikesCount: post.extendedLikesInfo.dislikesCount,
        likesCount: post.extendedLikesInfo.likesCount,
        myStatus: post.extendedLikesInfo.myStatus,
        newestLikes: post.extendedLikesInfo.newestLikes,
      },
      createdAt: post.createdAt,
    };
  }
}
