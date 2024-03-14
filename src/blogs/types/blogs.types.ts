import { IsString, Length, Matches } from "class-validator";
const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/

export class BlogInputCreateModel {
  @Length(2, 15)
  @IsString()
  name: string;

  @Length(2, 500)
  @IsString()
  description: string;

  @Length(3, 100)
  @IsString()
  @Matches(pattern)
  websiteUrl: string;
};

export type BlogViewModel = {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
};

export type WithId<T> = {
  id: string;
} & T;
