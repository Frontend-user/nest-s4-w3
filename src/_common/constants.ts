import { LikeStatus } from "../posts/types/post.types";

export interface ILikeStatus {
  LIKE: LikeStatus;
  DISLIKE: LikeStatus;
  NONE: LikeStatus;
}

export const LIKE_STATUSES: ILikeStatus = {
  LIKE: "Like",
  DISLIKE: "Dislike",
  NONE: "None",
};
export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,
  NOT_FOUND_404: 404,
  SERVER_ERROR_500: 500,
  NOT_AUTH_401: 401,
  SOMETHING_WRONG_400: 400,
};
