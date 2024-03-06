export type LikeStatus = 'None' | 'Like' | 'Dislike';

export type NewLikeStatusType = {
  addedAt: Date;
  login: string;
  userId: string;
};

export type PostInputCreateModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type PostViewModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  extendedLikesInfo: ExtendedLikesInfoType;
  createdAt: Date;
};

export type WithId<T> = {
  id: string;
} & T;

export type ExtendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: NewLikeStatusType[];
};
