export type BlogInputCreateModel = {
  name: string;
  description: string;
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
