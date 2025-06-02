export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  ChatList: undefined;
  ChatRoom: { chatId: string };
  FriendRequests: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
