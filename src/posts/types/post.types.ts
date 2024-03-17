import { Transform } from "class-transformer";
import { IsDefined, IsNotEmpty, IsString, Length, NotContains } from "class-validator";

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
  likeStatus: LikeStatus;
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

import { ValidationOptions, registerDecorator,  } from "class-validator";

export function IsNotEmptyString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isUppercase",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value.trim().length > 1) {
            return true; // Разрешить отсутствующие значения
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} can't be a empty string`;
        },
      },
    });
  };
}

export class PostInputCreateModel {
  @IsNotEmptyString()
  @Length(2, 30)
  @IsString()
  @IsDefined()
  title: string;

  @Transform(({ value }) => value?.trim())
  @Length(2, 100)
  @IsString()
  @IsDefined()
  shortDescription: string;

  @Transform(({ value }) => value?.trim())
  @Length(2, 1000)
  @IsDefined()
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
