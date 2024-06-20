export type NotOKType = {
  erorr: string;
};

export type User = {
  email: string;
  userDisplayName: string;
  avatar: string;
  _id: string;
};

export type products = {
  comments: string[];
  date: string;
  description: string;
  latitude: string;
  likes: number;
  longtitude: string;
  price: number;
  title: string;
  userDisplayName: string;
  userId: string;
  _id: string;
  images: string[];
};
