export type NotOKType = {
  erorr: string;
  chatRoomId: string;
  message: string;
};

export type User = {
  email: string;
  userDisplayName: string;
  avatar: userImage;
  id: string;
};

export type userImage = {
  url: string;
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
  userId: string;
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

export type state = {
  user: User;
};

export type likes = {
  _id: string;
  userId: User;
  likedItemId: products;
};

export type newchatRoomResponse = {
  newChatRoom: chatRoom;
};

export type chatRoom = {
  _id: string;
  itemId: products;
  userId: User;
  sellerId: User;
};

export type chatRoomResponse = {
  chatRooms: chatRoom;
};

export type messageSent = {
  chatUserId: string;
  message: string;
  chatUserName: string;
  _id: string;
  createdAt: string;
};
