export type NotOKType = {
  erorr: string;
};

export type User = {
  email: string;
  userDisplayName: string;
  avatar: string;
  id: string;
};

export type products = {
  comments: string[];
  createdAt: string;
  images: images[];
  price: number;
  title: string;
  updatedAt: string;
  description?: string;
  _id: string;
  likes?: number;
};

export type images = {
  public_id: string;
  url: string;
  _id: string;
};

export type LoinOkResponse = {
  message: string;
  token: string;
  user: User;
};

export type userProfile = {
  message: string;
  user: User;
};
