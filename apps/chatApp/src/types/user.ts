export interface IUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  friends?: IUser[];
  requests?: Array<{
    _id: string;
    from: IUser;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
}
