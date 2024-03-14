import { Transform } from "class-transformer";
import { IsString, Length } from "class-validator";

export type LikeStatus = "None" | "Like" | "Dislike";

export type NewLikeStatusType = {
  addedAt: Date;
  login: string;
  userId: string;
};

export class PostInputCreateModel {
  @Transform(({ value }) => value?.trim())
  @Length(2, 30)
  @IsString()
  title: string;

  @Transform(({ value }) => value?.trim())
  @Length(2, 100)
  @IsString()
  shortDescription: string;

  @Transform(({ value }) => value?.trim())
  @Length(2, 1000)
  @IsString()
  content: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
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
