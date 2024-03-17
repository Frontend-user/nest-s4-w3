import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Length, Validate } from "class-validator";

export type LikeStatus = "None" | "Like" | "Dislike";
export type usersIdsPostsLikeStatuses = { userId: string; likeStatus: string; addedAt: string; login: string };
export type usersIdsLikeStatuses = { userId: string; likeStatus: string };

export type newestLikes = { addedAt: string; userId: string; login: string };
export type NewLikeStatusType = {
  addedAt: Date;
  login: string;
  userId: string;
};

export class LikeStatusClass {
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  likeStatus: string;
}

export class PostInputCreateModelWithoutBlogId {
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
}

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { InjectModel } from "@nestjs/mongoose";
import { Blog } from "../../blogs/domain/blogs-schema";
import { Model, Types } from "mongoose";
import { BlogsQueryRepository } from "../../blogs/repositories/blogs.query-repository";

@ValidatorConstraint({ name: "customText", async: false })
export class CustomTextLength implements ValidatorConstraintInterface {
  constructor(protected blogsQueryRepository: BlogsQueryRepository) {}

  async validate(text: string, args: ValidationArguments) {
    const isExistBlog = await this.blogsQueryRepository.getBlogById(text);
    if (isExistBlog) {
      return true;
    } else {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return "Text ($value) is too short or too long!";
  }
}

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
}

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
  usersLikeStatuses?: any[];
};
